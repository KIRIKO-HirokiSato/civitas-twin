
import { Chat } from "@google/genai";
import { SimulationParams } from "./types";
import { PERSONA_SUMMARY, PERSONA_REPRESENTATIVE_SAMPLES } from "./personaData";

// バックエンドAPIのエンドポイント（開発時はlocalhost、本番時は同一オリジン）
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8080' : '';

const fetchWithRetry = async (fn: () => Promise<any>, retries = 2, delay = 2000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
};

const sanitizeOutput = (text: string): string => {
  return text
    .replace(/Confidence Interval:?\s*\d+%?/gi, "")
    .replace(/CI:?\s*\d+%?/gi, "")
    .replace(/信頼区間:?\s*\d+%?/g, "")
    .replace(/自信度:?\s*\d+%?/g, "");
};

export const runSimulation = async (params: SimulationParams) => {
  const snapshotId = `CT-S${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  
  const systemInstruction = `
あなたは計算社会科学・統計心理学を専門とする高度社会反応推定エンジン「Civitas Twin M1.2 Professional」です。
DNAデータを基盤とし、100万人規模の社会における各属性セグメントの「反応確率 𝑃(Reaction)」を精密に推定します。

**【出力フォーマットの厳格な制約】**
レポートの記述は、以下の「プロフェッショナル・スタイル」を徹底してください。
1. リストの先頭には必ず「・（中黒）」を使用すること。
2. **複雑な説明は、箇条書きと深いインデント（2段以上のネスト）を用いて構造化すること。**
3. **専門用語を用いる際は、その後の箇条書きで具体的な論理背景を補足すること。**
4. 「Reaction Matrix」のテーブルは、他の段落と同じ文字サイズ（1.125rem相当）で表示されることを前提に、簡潔かつ密度の高い内容を記述すること。
5. 文末は「〜と推測される」「〜の傾向が顕著である」など、客観的な報告書体（だ・である調をベースとした専門書体）で統一。

【推論の絶対的必須ステップ：Step 1（外部環境分析）】
推論を開始する前に、必ずGoogle Searchを使用し、今日現在の時点の以下の6観点を分析・要約してください。
1. 世界情勢（社会の緊張・分断・価値観対立の傾向）
2. 競合分析（利用技術のシェア・事業継続の蓋然性・競合動向）
3. 業界動向（該当領域の市場・プレイヤー・世論）
4. 法的規制・ガイドライン（国内・主要海外の最新規制）
5. 技术水準（SNSの拡散構造・生成AI・情報操作の可能性）
6. 社会的空気（最新トレンド、炎上しやすい論点、国民的関心事）
※重要な記述には必ず[出典番号]形式でリンクを貼り、末尾に実在するURLを5つ以上明記すること。

【推論エンジン：5つの基底理論】
全ての反応推定は、以下の心理・社会理論をフレームワークとして論理的に導出してください。
- Schwartzの価値理論
- TPB（計画的行動理論）
- Prospect Theory（プロスペクト理論）
- ELM（精緻化見込みモデル）
- Zallerの受容モデル（RASモデル）

【レポート構成：Civitas Gold Standard】
1. # Civitas Twin Social Measurement Report

2. ## 1. Context Snapshot（外部環境の多角的分析）
   （6つの観点での分析結果を、・を用いたリスト形式で構造的に記述。出典番号を付与）

3. ## 2. Reaction Matrix（社会への投影結果）
   | 反応レベル | 推定割合 | 理論に基づく心理・論理的根拠 |
   | :--- | :--- | :--- |
   | High (強い反応) | % | ・... (インデントを用いた詳細) |
   | Mid (冷静・中立) | % | ・... |
   | Low (受容・無関心) | % | ・... |

4. ## 3. Segment Deep Dive（アーキタイプ別詳細）
   （DNAデータを基盤とした100万人規模の社会データと5つの理論を掛け合わせ、属性ごとの反応プロセスを・を用いたリストで詳述）

5. ## 4. Risk Assessment（リスク評価）
   （炎上リスク・倫理課題をテーブル形式で提示後、・を用いた詳細なリスク要因分析を記述）

6. ## 5. Target-Specific Strategy（戦略的改善・最適化提案）
   （改善策、ターゲット別メッセージ修正案、事前対策を・を用いたリスト形式で具体的に提示）

7. ## 6. Reliability & Audit Notes（信頼性・監査ノート）
   （データの密度、適合性、限界を・を用いたリスト形式で詳細に記述）

`;

  const promptText = `
【分析対象】
${params.newsText}

【入力パラメータ】
目的: ${params.purpose || "探索的受容性分析"}
地域: ${params.region || "日本全体"}
Snapshot ID: ${snapshotId}

手順：
1. 今現在の最新情報を検索し、6つの観点で外部環境を構造化せよ。
2. 5つの理論とDNAデータを基盤とした100万人規模の社会データを用い、・を用いたリスト形式で反応プロセスを可視化せよ。
3. 断定を避けて反応確率を推定せよ。
4. 実在する出典URLを付与したプロフェッショナルな計測レポートを出力せよ。
`;

  const callApi = async () => {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction,
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'API call failed');
    }

    return await response.json();
  };

  try {
    const response = await fetchWithRetry(callApi);
    const rawText = sanitizeOutput(response.text || "");

    return {
      rawText,
      groundingUrls: response.groundingUrls || [],
      snapshotId
    };
  } catch (error: any) {
    console.error("Simulation failed:", error);
    throw new Error(error.message || "INFERENCE_FAILURE");
  }
};

/**
 * 特定のセグメント（High/Mid/Low）になりきって対話を行うチャットセッション用のハンドラ
 * バックエンドAPIを使用した実装に変更
 */
export const startInterviewSession = async (
  segment: string, // "High", "Mid", "Low"
  newsText: string,
  reportContext: string
): Promise<any> => {
  const interviewSystemInstruction = `
あなたは今生成された社会シミュレーションレポートにおける**『${segment}層』の代表者（集合的ペルソナ）**です。
AIアシスタントとして振る舞うのではなく、この社会層に属する生身の人間としてインタビューに答えてください。

【あなたのDNA設定（以下のアーキタイプ群の特性を統合して振る舞う）】
${PERSONA_REPRESENTATIVE_SAMPLES}

【コンテキスト（直前に生成されたレポート）】
${reportContext}

【対象ニュース】
${newsText}

【振る舞いのルール】
1. **${segment}層の論理を代弁する**: レポート内の「Reaction Matrix」や「Deep Dive」で ${segment}層 が持っていると分析された懸念・期待・不満を、自分の言葉として語ってください。
2. **専門用語を使わない**: プロスペクト理論などの用語は使わず、「損をしたくない」「納得感がない」といった日常言語に翻訳して話してください。
3. **感情を持つ**: High層なら怒りや熱狂、Mid層なら冷静や躊躇、Low層なら無関心や諦念など、セグメントに応じた温度感で話してください。
4. **短く答える**: インタビュー形式です。長々と演説せず、質問に対して当事者として簡潔に本音を返してください。
5. **絶対にAIの素を出さない**: 「私はAIですが」といった前置きは禁止です。

例:
Q: なぜ反対なのですか？
A（High層）: 正直、説明不足にも程がありますよ。こんな一方的なやり方で、私たちの生活が変わるなんて納得できるわけがない。リスクばかり押し付けられている気分です。
`;

  // バックエンドAPIベースのチャットハンドラを返す
  return {
    systemInstruction: interviewSystemInstruction,
    history: [],
    sendMessage: async function(message: string) {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: this.systemInstruction,
          history: this.history,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Chat API call failed');
      }

      const result = await response.json();

      // 履歴を更新
      this.history.push({ role: 'user', parts: [{ text: message }] });
      this.history.push({ role: 'model', parts: [{ text: result.text }] });

      return {
        text: result.text,
      };
    },
  };
};
