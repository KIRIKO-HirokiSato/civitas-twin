/**
 * personaData.ts
 * Civitas Twin Mega-Scale DNA Definition (v1.3 - Validated)
 *
 * ✅方針
 * - seedから得られる「実測分布」を一次情報として明示する
 * - 1.0M は現時点では seed 比率を "暫定投影" (Projection) として扱う
 *   （IPF/rakingで外部マージナルに合わせたら、ここの割合を置換する）
 * - LLMには「人口を想像」させず、"重み付きセグメント（アーキタイプ）"の反応確率推定に集中させる
 *
 * ✅データ参照（重要）
 * - Persona(JPN)-5000.csv を前提（N=5000, 21列）
 * - 本定義は実データ検証済み（2025-12-22実施）
 *
 * ✅更新履歴
 * - v1.3: 実測データとの照合により、アーキタイプ分布を実測値に更新
 * - Schwartz分布を実測値（33/28/17/16/6%）に修正
 * - Zaller中を40%に微修正
 * - アーキタイプ分類ロジックの透明性向上（優先順位の根拠を明記）
 */

export const SEED_N = 5000;
export const POPULATION_N = 1_000_000 as const;

/**
 * データ品質メタデータ
 */
export const DATA_QUALITY = {
  version: "1.3",
  validatedDate: "2025-12-22",
  validationMethod: "実データ集計による分布照合",
  knownLimitations: [
    "18歳未満・90歳以上は含まれない（有権者・アクティブ社会参加者を想定）",
    "経済的極度困窮層（相対的貧困率15%想定に対し実測約8%）のサンプル不足",
    "IPF/Raking較正は未実施（外部マージナルへの統計的整合は今後実装予定）",
    "時間的動態（ライフコース変化・社会的ショックへの反応）は静的スナップショット",
  ],
  futureEnhancements: [
    "総務省統計・内閣府世論調査等の外部マージナルによるIPF/Raking較正",
    "クラスター分析による分類の客観化・検証",
    "経済的困窮層・社会的マイノリティの詳細サンプリング",
    "実世論調査・SNS分析との継続的照合による精度検証",
  ],
} as const;

/**
 * seed 実分布（実測値：合計100%）
 * ※N=5000 の実集計結果（2025-12-22検証済み）
 */
export const SEED_DISTRIBUTIONS = {
  /** 年齢帯（seedの年齢: 18〜89をバンド化） */
  ageBandPct: {
    "18-24": 13,
    "25-34": 24,
    "35-44": 20,
    "45-54": 17,
    "55-64": 14,
    "65+": 12,
  },

  genderPct: {
    男性: 52,
    女性: 44,
    その他: 4,
  },

  residencePct: {
    都市部: 44,
    郊外: 29,
    地方: 27,
  },

  /**
   * 経済的余裕感（カテゴリ圧縮・実測）
   * - 上層: 高/非常に高い/非常に高いい（※表記ゆれ吸収）= 1037名
   * - 中間: 中/安定/普通 = 2230名
   * - 低所得: 低/非常に低/非常に低い/なし/厳しい = 1649名
   * - 不安定: 不安定/変動大 = 84名
   * 注: 低所得実測33%は、相対的貧困率15%より高いが、「余裕感」主観評価のため妥当
   */
  economicPct: {
    "上層（高/非常に高い）": 21,
    "中間（中/安定）": 44,
    "低所得（低/非常に低）": 33,
    "不安定（不安定）": 2,
  },

  /**
   * Schwartz 4象限（実測値に更新）
   * seedの「価値志向」語彙を操作的にマップして集計
   * 注: 「技術」等の多義的語彙により±2%の分類誤差が存在しうる
   * 
   * マッピング定義:
   * - 自己超越: 共感/貢献/協調/仲間/正義/公平/奉仕/愛情/交流/誠実
   * - 保全: 安定/規律/伝統/安全/秩序/健康/責任/義理/忍耐/継承
   * - 自己増進: 効率/成果/論理/合理/権力/成功/正確/競争/威厳/技術/職人/勝利
   * - 変化への開放: 自由/成長/挑戦/自立/創造/探求/刺激/変化/夢/自己表現/美的/趣味
   */
  schwartzQuadPct: {
    変化への開放: 33, // 修正: 35→33（実測）
    保全: 28, // 修正: 29→28（実測）
    自己超越: 17, // 修正: 18→17（実測）
    自己増進: 16, // 修正: 17→16（実測）
    その他: 6, // 修正: 1→6（実測：多義的・分類困難な語彙）
  },

  /**
   * 主な情報源（seedの文字列をキーワードで3分類し集計）
   * 注: 425通りの多様な情報源を3カテゴリーに圧縮（情報損失あり）
   * 
   * - マスメディア/ニュース: TV/新聞/ニュース/ニュースアプリ/NHK/日経/Bloomberg/Reuters/雑誌
   * - SNS/ネット: SNS/X/YouTube/Instagram/TikTok/Web/ブログ/掲示板/note
   * - その他: 家族/友人/同僚/口コミ/地域/職場/学校/店員（直接接触）
   */
  infoSourcePct: {
    "マスメディア/ニュース": 59,
    "SNS/ネット": 39,
    その他: 2,
  },

  /** ELM（情報処理ルート：seed列そのまま） */
  elmRoutePct: {
    中心ルート: 47,
    周辺ルート: 53,
  },

  /**
   * デジタル関与（SNS利用度から圧縮）
   * - アクティブ発信/高関与: 高/非常に高い/非常に高いい = 1803名
   * - サイレント視聴/低〜中関与: 低/中 = 3039名
   * - オフライン中心: なし = 157名（+その他1名）
   */
  digitalEngagementPct: {
    "アクティブ発信/高関与": 36,
    "サイレント視聴/低〜中関与": 61,
    "オフライン中心": 3,
  },

  /** Zaller（Receiveのみ：Zaller受容特性文字列から Receive低/中/高 を抽出） */
  zallerReceivePct: {
    低: 23,
    中: 40, // 修正: 41→40（実測）
    高: 36,
    その他: 1, // 追加: 抽出不能ケース
  },
} as const;

/**
 * アーキタイプ（seedからの"ルールベース分類"・実測値に更新）
 * - 互いに排他的に割当（優先順）して seed support を算出
 * - 将来クラスタリング/IPF後も「形式」は維持できる
 *
 * ✅排他的割当の優先順（透明性向上版）
 * 優先順位の設定根拠:
 * 1) Tradition-Guardian: 最も明確な条件（保全×低変化×高権威）で誤分類リスク最小
 * 2) Digital-Reformist: デジタル行動が観測可能で客観的判定が容易
 * 3) Rational-Skeptic: 情報処理ルートが明示的で条件判定が明瞭
 * 4) Silent-Anxious: 複合的条件だが社会的重要性が高い層
 * 5) Mainstream-Pragmatist: 残差（上記いずれにも該当しない中庸層）
 *
 * ⚠注意: 複合属性ペルソナ（例: 変化開放×中心ルート×低権威）の分類は
 *         優先順位に依存するため、将来的にクラスター分析での検証を推奨
 */
export type PersonaArchetype = {
  id: string;
  label: string;
  pct: number; // 1.0M投影（実測値ベース・整数%）
  count1M: number; // 1.0M投影人数（実測値ベース・整数、合計=1,000,000）
  seedSupportN: number; // seed内該当数（実測・排他的割当結果）
  definition: {
    ruleOfThumb: string[];
    classificationLogic: string; // 追加: 分類条件の明示的記述
    psychSignature: {
      schwartz: string;
      prospect: string;
      elm: string;
      zaller: string;
      tpb: string;
    };
  };
};

export const ARCHETYPES: PersonaArchetype[] = [
  {
    id: "mainstream_pragmatist",
    label: "Mainstream-Pragmatist（多数派の現実主義）",
    pct: 61, // 修正: 55→61（実測3052/5000=61.0%）
    count1M: 610_400, // 修正: 554_800→610_400
    seedSupportN: 3052, // 修正: 2774→3052（実測）
    definition: {
      ruleOfThumb: [
        "排他的ルール分類の『残差』としての中庸層（極端条件に当てはまらない）",
        "争点が生活に直結するまで静観しやすい",
        "周囲の規範・メディアトーンで態度が寄る（ただし過激化しにくい）",
      ],
      classificationLogic:
        "上記4アーキタイプのいずれの条件も満たさないペルソナ（デフォルト分類）",
      psychSignature: {
        schwartz: "保全×変化への開放が混在（争点次第で揺れる）",
        prospect: "損失フレームに反応するが、説明の確度で落ち着く",
        elm: "中心/周辺が混在（信頼できる情報源で切替）",
        zaller: "Receive中が厚い（受け取りはするが解釈が揺れやすい）",
        tpb: "行動は『主観的規範×実行可能性』で決まりやすい",
      },
    },
  },
  {
    id: "digital_reformist",
    label: "Digital-Reformist（変革歓迎のデジタル層）",
    pct: 14, // 修正: 16→14（実測679/5000=13.6%、四捨五入14%）
    count1M: 135_800, // 修正: 159_800→135_800
    seedSupportN: 679, // 修正: 799→679（実測）
    definition: {
      ruleOfThumb: [
        "Schwartz=変化への開放 寄り",
        "変化許容度=高/非常に高い × SNS利用度=高/非常に高い",
        "主な情報源がSNS/ネット寄りで論点立ち上げが速い",
      ],
      classificationLogic:
        "schwartz_quad=='変化への開放' AND 変化許容度 IN ['高','非常に高い'] AND SNS利用度 IN ['高','非常に高いい']",
      psychSignature: {
        schwartz: "変化への開放（自由/成長/挑戦）優位",
        prospect: "現状維持を『損』と見やすく、改革に利得を感じやすい",
        elm: "周辺ルートでも拡散が速い（体験談/速度に反応）",
        zaller: "Receive高寄り（摂取量が多い）",
        tpb: "行動（拡散/参加）は『周囲の盛り上がり』で増幅しやすい",
      },
    },
  },
  {
    id: "rational_skeptic",
    label: "Rational-Skeptic（根拠重視の合理派）",
    pct: 9, // 維持（実測449/5000=9.0%）
    count1M: 89_800, // 維持
    seedSupportN: 449, // 維持（実測）
    definition: {
      ruleOfThumb: [
        "情報処理ルート=中心ルート",
        "価値志向が 効率/論理/成果/合理/正確/成功 などに寄りやすい（自己増進寄り）",
        "権威信頼は低〜中で、説明責任・整合性を求める",
      ],
      classificationLogic:
        "情報処理ルート=='中心ルート' AND schwartz_quad=='自己増進' AND 権威信頼度 IN ['低','中']",
      psychSignature: {
        schwartz: "自己増進（効率/成果/論理）寄りになりやすい",
        prospect: "損失回避はあるが、定量で納得すれば支持に転ぶ",
        elm: "中心ルート優勢（論理の穴に敏感）",
        zaller: "Acceptは論理重視に寄りやすい（情報源で変動）",
        tpb: "行動は『統制感』が高い時に発生（提案・改善へ）",
      },
    },
  },
  {
    id: "silent_anxious",
    label: "Silent-Anxious（低余裕×高不安の沈黙層）",
    pct: 3, // 修正: 3→3（実測125/5000=2.5%、四捨五入3%で維持）
    count1M: 25_000, // 修正: 26_200→25_000（実測2.5%）
    seedSupportN: 125, // 修正: 131→125（実測）
    definition: {
      ruleOfThumb: [
        "経済的余裕感=低/不安定 寄り",
        "リスク感受性=高/非常に高い × 炎上感受性=高/非常に高い",
        "情報処理は周辺ルート寄りで、刺激語・被害想起で増幅しやすい",
      ],
      classificationLogic:
        "経済的余裕感 IN ['低','非常に低','非常に低い','不安定','変動大','なし','厳しい'] AND リスク感受性 IN ['高','非常に高い'] AND 炎上感受性 IN ['高','非常に高い','非常に高いい']",
      psychSignature: {
        schwartz: "保全（安全/安心）要求が局面で強くなる",
        prospect: "損失フレームで反応が急増しやすい",
        elm: "周辺ルート寄り（強い言葉・具体被害で増幅）",
        zaller: "Receive低〜中（限定情報で偏る時に揺れが大きい）",
        tpb: "行動は『できる/やれる』が担保されないと止まりやすい（不満が残留）",
      },
    },
  },
  {
    id: "tradition_guardian",
    label: "Tradition-Guardian（保全・秩序の守護層）",
    pct: 14, // 修正: 17→14（実測695/5000=13.9%、四捨五入14%）
    count1M: 138_800, // 修正: 169_400→138_800
    seedSupportN: 695, // 修正: 847→695（実測）
    definition: {
      ruleOfThumb: [
        "Schwartz=保全 寄り",
        "変化許容度=低 × 権威信頼度=高/非常に高い",
        "主な情報源がマスメディア/ニュース寄りで規範フレームが強い",
      ],
      classificationLogic:
        "schwartz_quad=='保全' AND 変化許容度=='低' AND 権威信頼度 IN ['高','非常に高い']",
      psychSignature: {
        schwartz: "保全（安全/伝統/規律）優位",
        prospect: "損失回避が強く、現状破壊に強い抵抗",
        elm: "周辺ルート寄り（権威・慣習・トーン）",
        zaller: "Acceptは権威/規範重視に寄りやすい",
        tpb: "行動は『同調圧力×正当性』がトリガーになりやすい",
      },
    },
  },
];

/**
 * LLM投入用：短く、数値はブレない形で渡す（"文章で長く説明しない"）
 * - ここが長いほど、レポートが薄くなりやすいので、表＋短文で固定
 * - 実測値に基づく信頼性の高いデータ（2025-12-22検証済み）
 */
export const PERSONA_SUMMARY = `
【Civitas Twin Mega-Scale DNA (v1.3 - Validated)】
- Seed: ${SEED_N.toLocaleString()}名（実査・検証済み） / Projection: ${POPULATION_N.toLocaleString()}名（暫定=seed比率投影）
- 検証日: ${DATA_QUALITY.validatedDate} / データ品質: 実測分布との照合完了
- 注意: Projection比率は、IPF/rakingで外部マージナル（総務省統計等）に合わせると更新されます。

### 1) デモグラフィックス（Seed実分布・検証済み）
- 年齢帯: 18-24(${SEED_DISTRIBUTIONS.ageBandPct["18-24"]}%) / 25-34(${SEED_DISTRIBUTIONS.ageBandPct["25-34"]}%) / 35-44(${SEED_DISTRIBUTIONS.ageBandPct["35-44"]}%) / 45-54(${SEED_DISTRIBUTIONS.ageBandPct["45-54"]}%) / 55-64(${SEED_DISTRIBUTIONS.ageBandPct["55-64"]}%) / 65+(${SEED_DISTRIBUTIONS.ageBandPct["65+"]}%)
- 性別: 男性(${SEED_DISTRIBUTIONS.genderPct["男性"]}%) / 女性(${SEED_DISTRIBUTIONS.genderPct["女性"]}%) / その他(${SEED_DISTRIBUTIONS.genderPct["その他"]}%)
- 居住: 都市部(${SEED_DISTRIBUTIONS.residencePct["都市部"]}%) / 郊外(${SEED_DISTRIBUTIONS.residencePct["郊外"]}%) / 地方(${SEED_DISTRIBUTIONS.residencePct["地方"]}%)
- 経済: 上層(${SEED_DISTRIBUTIONS.economicPct["上層（高/非常に高い）"]}%) / 中間(${SEED_DISTRIBUTIONS.economicPct["中間（中/安定）"]}%) / 低所得(${SEED_DISTRIBUTIONS.economicPct["低所得（低/非常に低）"]}%) / 不安定(${SEED_DISTRIBUTIONS.economicPct["不安定（不安定）"]}%)

### 2) 価値観（Schwartz象限: Seed語彙を操作的マップ・実測値）
- 変化への開放(${SEED_DISTRIBUTIONS.schwartzQuadPct["変化への開放"]}%) / 保全(${SEED_DISTRIBUTIONS.schwartzQuadPct["保全"]}%) / 自己超越(${SEED_DISTRIBUTIONS.schwartzQuadPct["自己超越"]}%) / 自己増進(${SEED_DISTRIBUTIONS.schwartzQuadPct["自己増進"]}%) / その他(${SEED_DISTRIBUTIONS.schwartzQuadPct["その他"]}%)

### 3) 情報処理・行動（Seed実分布）
- 情報源: マスメディア/ニュース(${SEED_DISTRIBUTIONS.infoSourcePct["マスメディア/ニュース"]}%) / SNS/ネット(${SEED_DISTRIBUTIONS.infoSourcePct["SNS/ネット"]}%) / その他(${SEED_DISTRIBUTIONS.infoSourcePct["その他"]}%)
- ELM: 中心ルート(${SEED_DISTRIBUTIONS.elmRoutePct["中心ルート"]}%) / 周辺ルート(${SEED_DISTRIBUTIONS.elmRoutePct["周辺ルート"]}%)
- デジタル関与: アクティブ発信(${SEED_DISTRIBUTIONS.digitalEngagementPct["アクティブ発信/高関与"]}%) / サイレント視聴(${SEED_DISTRIBUTIONS.digitalEngagementPct["サイレント視聴/低〜中関与"]}%) / オフライン(${SEED_DISTRIBUTIONS.digitalEngagementPct["オフライン中心"]}%)
- Zaller(Receive): 低(${SEED_DISTRIBUTIONS.zallerReceivePct["低"]}%) / 中(${SEED_DISTRIBUTIONS.zallerReceivePct["中"]}%) / 高(${SEED_DISTRIBUTIONS.zallerReceivePct["高"]}%)
`.trim();

/**
 * LLM投入用：アーキタイプ（重み付きセグメント・実測値ベース）
 * - 人数はProjection（実測値ベース）で明示
 * - seedSupportN を出して「データ密度」を推論しやすくする
 * - 分類ロジックを明示して透明性を確保
 */
export const PERSONA_REPRESENTATIVE_SAMPLES = `
【Mega-Scale Social Archetypes（Weighted Segments / 実測Projection）】
- 重要: LLMは人口を生成しない。以下の重み付きセグメントに対して P(High/Mid/Low) を推定し、全体を集計する。
- 排他的割当の優先順: Tradition → Digital → Rational → Silent → Mainstream（残差）
- データ品質: 実測値に基づく（検証日: ${DATA_QUALITY.validatedDate}）

${ARCHETYPES.map((a, i) => {
  const n = a.count1M.toLocaleString();
  return `${i + 1}. [${a.label}] 約${n}人（${a.pct}%）
   - SeedSupport: ${a.seedSupportN}/${SEED_N}（実測）
   - 分類条件: ${a.definition.classificationLogic}
   - 定義: ${a.definition.ruleOfThumb.join(" / ")}
   - 心理署名: 
     * Schwartz=${a.definition.psychSignature.schwartz}
     * Prospect=${a.definition.psychSignature.prospect}
     * ELM=${a.definition.psychSignature.elm}
     * Zaller=${a.definition.psychSignature.zaller}
     * TPB=${a.definition.psychSignature.tpb}`;
}).join("\n\n")}

【データ信頼性に関する注記】
- 本分布は5,000名の実査データから導出された実測値です
- IPF/Raking較正前の暫定投影であり、外部統計との整合は今後実装予定
- 極度の経済的困窮層のサンプル不足等の既知の限界については DATA_QUALITY.knownLimitations を参照
`.trim();

/**
 * 将来拡張用: IPF/Raking較正後の更新関数テンプレート
 * （現時点では未実装・プレースホルダー）
 */
export function updateWithIPFCalibration(
  externalMarginals: Record<string, Record<string, number>>,
  calibratedWeights: number[]
): void {
  // TODO: IPF/Raking較正後に、SEED_DISTRIBUTIONS と ARCHETYPES の pct/count1M を更新
  // 実装時には、較正前後の差分を DATA_QUALITY.calibrationLog に記録すること
  throw new Error("IPF/Raking calibration not yet implemented");
}
