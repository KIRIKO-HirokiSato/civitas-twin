
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { runSimulation, startInterviewSession } from './geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'https://esm.sh/remark-gfm@4.0.0';
import rehypeRaw from 'rehype-raw';
import { Chat, GenerateContentResponse } from "@google/genai";
import { HistoryItem, ChatMessage } from './types';

const AboutContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fade-in space-y-48 pb-40 max-w-4xl mx-auto">
      {/* 0. Header */}
      <div className="flex flex-col gap-12 border-b border-white/20 pb-16">
        <div className="space-y-4">
          <h2 className="text-7xl font-extrabold text-white tracking-tighter uppercase leading-none">Core.<br/><span className="opacity-40">Architecture.</span></h2>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-white/60 text-sm tracking-widest font-light italic">Civitas Twin Professional Edition v1.2</p>
          <button 
            onClick={onClose}
            className="px-8 py-4 border border-white/20 hover:border-white text-[10px] uppercase tracking-[0.5em] font-black text-white transition-all flex items-center gap-4 bg-white/5"
          >
            Exit About
            <span className="text-white/40 font-mono">ESC</span>
          </button>
        </div>
      </div>

      {/* 1. Core Logic (The 3 Steps) */}
      <section className="space-y-16">
        <div className="space-y-6">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Logic.<br/><span className="opacity-40">Generation.</span></h3>
          <p className="text-[1.125rem] font-light text-white leading-[2.0] italic tracking-tight">
            Civitas Twinは、単なる大規模言語モデルではありません。以下の3段階の厳密なプロセスを経て、社会反応を「生成」ではなく「導出」します。
          </p>
        </div>

        <div className="space-y-0 border-t border-white/10">
          {/* Item 1: Persona Creation */}
          <div className="group py-12 border-b border-white/10 hover:bg-white/5 transition-all px-4">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest w-32 pt-2">Phase 01</div>
              <div className="flex-1 space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:tracking-normal transition-all duration-500">
                  Hyper-Resolution Persona
                </h4>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/50 bg-white/5 inline-block px-3 py-1 mb-2">
                  Target: N=5,000 (Seed Data)
                </div>
                <p className="text-[1.0rem] text-white/80 leading-[2.0] font-light">
                  基本的な「性別・年齢・年収」に加え、<strong>リスク感受性・意思決定速度・情報処理ルート</strong>など、行動原理に関わる21項目以上のパラメータを持つ特殊ペルソナを5,000体生成。一般的な顧客属性を超えた、深層心理レベルのモデリングを実現しています。
                </p>
              </div>
            </div>
          </div>

          {/* Item 2: DNA Projection & Theories */}
          <div className="group py-12 border-b border-white/10 hover:bg-white/5 transition-all px-4">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest w-32 pt-2">Phase 02</div>
              <div className="flex-1 space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:tracking-normal transition-all duration-500">
                  Mega-Scale DNA Projection
                </h4>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/50 bg-white/5 inline-block px-3 py-1 mb-2">
                  Scale: N=1,000,000 (Projection)
                </div>
                <p className="text-[1.0rem] text-white/80 leading-[2.0] font-light">
                  5,000人のシード比率を維持したまま100万人規模へ投影。さらに5つの主要社会心理学理論（<strong>Schwartz価値理論, Prospect理論, ELM, Zaller, TPB</strong>）を統合した「心理学的シグネチャ」を全エージェントに付与。これによりAI特有のハルシネーション（幻覚）を排除し、理論的整合性を保証します。
                </p>
              </div>
            </div>
          </div>

          {/* Item 3: Inference Control */}
          <div className="group py-12 border-b border-white/10 hover:bg-white/5 transition-all px-4">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest w-32 pt-2">Phase 03</div>
              <div className="flex-1 space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:tracking-normal transition-all duration-500">
                  Strict Inference Control
                </h4>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/50 bg-white/5 inline-block px-3 py-1 mb-2">
                  Engine: Logic Frame + Google Search
                </div>
                <p className="text-[1.0rem] text-white/80 leading-[2.0] font-light">
                  AIの推論を厳格な理論フレーム内に制限し、自由記述によるブレを防ぎます。同時に<strong>Google Search</strong>と連携させることで、最新の社会的トレンド・法的規制・競合動向をリアルタイムに環境変数として取り込み、常に高品質で現実に即した結果を出力します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strategic Evolution (Business Application) */}
      <section className="space-y-12">
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">From Analysis.<br/><span className="opacity-40">To Simulation.</span></h3>
        <p className="text-[1.125rem] text-white/80 leading-[2.0] max-w-2xl font-light">
          Civitas Twinは現在、日本国民の標準ペルソナを搭載していますが、真価は企業の独自データとの統合にあります。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-white/10 bg-white/[0.02] space-y-6">
                <div className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/40">Capability 01</div>
                <h4 className="text-xl font-bold text-white">「過去の分析」から「未来の実験」へ</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                    既存の顧客分析ペルソナを追加することで、静的な現状分析から「今、この瞬間の現実社会で自社製品がどう受け入れられるか」というリアルタイムな反応予測シミュレーターへと進化します。失敗できない施策の「実験場」となります。
                </p>
            </div>
            <div className="p-8 border border-white/10 bg-white/[0.02] space-y-6">
                <div className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/40">Capability 02</div>
                <h4 className="text-xl font-bold text-white">「サイレント・マジョリティ」の可視化</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                    SNS分析では見えない「何も反応しない中間層」が、なぜ沈黙しているのか。無関心なのか、躊躇しているのか。従来の手法では捕捉不可能だったサイレント層の心理構造を理論的に解明します。
                </p>
            </div>
            <div className="md:col-span-2 p-8 border border-white/10 bg-gradient-to-r from-white/5 to-transparent space-y-6 relative overflow-hidden">
                 <div className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/40">New Feature</div>
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h4 className="text-xl font-bold text-white">Direct Persona Interview</h4>
                 </div>
                 <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                    High層（熱狂）、Mid層（静観）、Low層（無関心）。シミュレーションで明らかになった各層の代表ペルソナに対し、チャット形式で直接インタビューが可能です。「なぜそう思うのか？」を深掘りする定性調査が、この場ですぐに完結します。
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [newsText, setNewsText] = useState('');
  const [purpose, setPurpose] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeParams, setActiveParams] = useState<{newsText: string, purpose: string, region: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Chat State
  const [chatSegment, setChatSegment] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatInstanceRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const MAX_CHARS = 3000;
  const reportRef = useRef<HTMLDivElement>(null);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const loadingMessages = [
    "ACQUIRING NOW CONTEXT SNAPSHOT...",
    "ANALYZING EXTERNAL TRENDS & REGS...",
    "MAPPING SOCIAL DNA ARCHETYPES...",
    "EXECUTING PROBABILITY INFERENCE...",
    "FINALIZING AUDIT-READY REPORT..."
  ];

  const handleInitialize = useCallback(() => {
    setResult(null);
    setNewsText('');
    setActiveParams(null);
    setError(null);
    setShowAbout(false);
    setChatSegment(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (chatSegment) {
          setChatSegment(null);
        } else {
          setShowAbout(false);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chatSegment]);

  // Chat Scroll to Bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatSegment]);

  const handleSimulate = useCallback(async () => {
    if (!newsText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowAbout(false);
    setActiveParams({ newsText, purpose, region });

    try {
      const data = await runSimulation({ newsText, purpose, region, today: todayStr });
      setResult(data);
      
      const newHistory: HistoryItem = {
        id: data.snapshotId || `CT-${Date.now()}`,
        title: newsText.slice(0, 24) + '...',
        date: new Date().toLocaleTimeString(),
        newsText,
        purpose,
        region,
        result: data
      };
      setHistory(prev => [newHistory, ...prev]);
    } catch (err: any) {
      setError('推論エンジンが停止しました。接続環境または入力内容を確認してください。');
    } finally {
      setIsLoading(false);
    }
  }, [newsText, purpose, region, todayStr]);

  const selectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setActiveParams({ newsText: item.newsText, purpose: item.purpose, region: item.region });
    setNewsText('');
    setShowAbout(false);
    setError(null);
    setChatSegment(null);
  };

  const truncateText = (text: string, maxLen: number) => {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.rawText);
    setCopyFeedback("COPIED TO CLIPBOARD");
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // --- Chat Functions ---

  const openInterview = async (segment: string) => {
    if (!result || !activeParams) return;
    setChatSegment(segment);
    setChatMessages([]);
    setIsChatLoading(true);
    
    try {
      const chat = await startInterviewSession(segment, activeParams.newsText, result.rawText);
      chatInstanceRef.current = chat;
      
      // Initial Greeting based on segment
      let initialGreeting = "";
      if (segment.includes("High")) initialGreeting = "（強い関心と懸念を持った表情で）...話を聞きましょう。一体これはどういうことなんですか？";
      else if (segment.includes("Mid")) initialGreeting = "（腕を組んで考え込みながら）まあ、言いたいことはわかりますが...まだ判断材料が足りない気がしますね。";
      else initialGreeting = "（あまり興味がなさそうに）ええ、まあ...正直、自分にはあまり関係ない話だと思っていますが。";

      setChatMessages([{
        role: 'model',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (e) {
      console.error(e);
      setChatMessages([{
        role: 'model',
        text: "Error: Interview link lost. Connection failed.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatInstanceRef.current) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString() }]);
    setIsChatLoading(true);

    try {
      const response: GenerateContentResponse = await chatInstanceRef.current.sendMessage(userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "", timestamp: new Date().toLocaleTimeString() }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-zinc-300 bg-transparent font-sans selection:bg-white/20">
      <aside className="w-80 border-r border-white/10 flex flex-col glass z-50 no-print">
        <div className="p-10 h-28 flex items-center">
          <button 
            onClick={handleInitialize}
            className="flex flex-col text-left group"
          >
            <span className="font-sans font-extrabold text-2xl text-white tracking-tighter leading-none uppercase group-hover:text-white/80 transition-colors">Civitas Twin</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto sidebar-scroll p-8 space-y-4">
          <div className="text-[8px] text-zinc-500 py-4 uppercase tracking-[0.3em] font-extrabold border-b border-white/5 mb-6">Simulation Registry</div>
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => selectHistory(item)}
              className={`w-full text-left p-6 rounded-sm transition-all group border-l-2 mb-2 ${
                result === item.result && !showAbout ? 'border-white bg-white/10 text-white' : 'border-transparent hover:bg-white/5 hover:border-zinc-700'
              }`}
            >
              <div className="text-[10px] font-mono font-bold truncate tracking-widest text-zinc-400 group-hover:text-white transition-colors uppercase">
                {item.id}
              </div>
              <div className="text-[9px] text-zinc-500 mt-2 truncate leading-relaxed">{item.title}</div>
              <div className="text-[7px] text-zinc-600 mt-2 uppercase tracking-[0.2em] font-bold">{item.date}</div>
            </button>
          ))}
        </div>
        <div className="p-10 space-y-3">
           <button 
             onClick={() => setShowAbout(true)}
             className={`w-full py-3 rounded-sm border text-[8px] uppercase tracking-[0.4em] font-bold transition-all flex items-center justify-center gap-2 ${showAbout ? 'border-white text-white bg-white/10' : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/20'}`}
           >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             Project Architecture
           </button>
           <button 
             onClick={handleInitialize}
             className="w-full py-4 rounded-sm border border-white/10 text-[9px] uppercase tracking-[0.4em] font-extrabold text-zinc-400 hover:border-white hover:text-white transition-all bg-white/[0.02]"
           >
             Initialize Protocol
           </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-transparent">
        <div className={`mx-auto px-16 py-28 min-h-full relative z-10 transition-all duration-700 ${result || showAbout ? 'max-w-6xl' : 'max-w-4xl'}`}>
          
          {showAbout ? (
            <AboutContent onClose={() => setShowAbout(false)} />
          ) : (
            <>
              {!result && !isLoading && (
                <div className="space-y-32 fade-in">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-14">
                      <span className="w-10 h-[1px] bg-white/30"></span>
                      <span className="text-[9px] uppercase tracking-[0.8em] font-bold text-white/50">Model: CT-M1.2 Professional Edition</span>
                    </div>
                    <h1 className="font-sans font-extrabold text-7xl text-white leading-none tracking-tighter uppercase drop-shadow-lg">
                      Social.<br /><span className="text-white/40">Inference.</span>
                    </h1>
                    <p className="text-white/80 font-light max-w-lg leading-relaxed text-sm tracking-widest italic drop-shadow-md">
                      現在の多角的状況分析と行動心理理論、そして1M規模に投影された精緻なペルソナデータを統合。社会反応を客観的かつ論理的に予測・推定します。
                    </p>
                    {error && <div className="mt-8 p-6 border border-red-500/30 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-widest">{error}</div>}
                  </div>

                  <div className="space-y-24">
                    <div className="relative group">
                      <div className="absolute -left-12 top-0 text-[10px] font-mono font-bold text-white/40 tracking-widest opacity-60 uppercase">I</div>
                      <div className="flex justify-between items-end border-b border-white/20 mb-8 pb-2">
                        <label className="block text-[8px] uppercase tracking-[0.5em] font-bold text-white/60 w-max">Analysis Subject</label>
                        <span className={`text-[10px] font-mono tracking-widest font-bold ${newsText.length >= MAX_CHARS ? 'text-red-500' : 'text-white/40'}`}>
                          {newsText.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                        </span>
                      </div>
                      <textarea
                        value={newsText}
                        onChange={(e) => setNewsText(e.target.value)}
                        maxLength={MAX_CHARS}
                        placeholder="解析対象（新サービス・プロダクト / 事象・ニュース / 広報メッセージ / 政策・法改正など）を入力してください..."
                        className="w-full h-40 bg-transparent border-none outline-none text-[1.125rem] font-sans font-medium text-white placeholder:text-white/20 resize-none leading-[2.0]"
                      />
                      <div className="h-[1px] w-full bg-white/10 group-focus-within:bg-white/60 transition-all duration-1000"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-24">
                      <div className="relative group">
                        <div className="absolute -left-12 top-0 text-[10px] font-mono font-bold text-white/40 tracking-widest opacity-60 uppercase">II</div>
                        <label className="block text-[8px] uppercase tracking-[0.5em] font-bold text-white/60 mb-4 border-b border-white/20 pb-2 w-max">Measurement Objective</label>
                        <input
                          type="text"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          placeholder="目的 / 対象者 / 条件"
                          className="w-full bg-transparent border-none outline-none py-4 text-[1.125rem] text-zinc-200 placeholder:text-white/20 font-medium leading-relaxed"
                        />
                        <div className="h-[1px] w-full bg-white/10 group-focus-within:bg-white/60 transition-all duration-1000"></div>
                      </div>
                      <div className="relative group">
                        <div className="absolute -left-12 top-0 text-[10px] font-mono font-bold text-white/40 tracking-widest opacity-60 uppercase">III</div>
                        <label className="block text-[8px] uppercase tracking-[0.5em] font-bold text-white/60 mb-4 border-b border-white/20 pb-2 w-max">Geo-Scope</label>
                        <input
                          type="text"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          placeholder="日本全体（都市部 / 郊外 / 地方）"
                          className="w-full bg-transparent border-none outline-none py-4 text-[1.125rem] text-zinc-200 placeholder:text-white/20 font-medium leading-relaxed"
                        />
                        <div className="h-[1px] w-full bg-white/10 group-focus-within:bg-white/60 transition-all duration-1000"></div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-24">
                      <button
                        onClick={handleSimulate}
                        disabled={!newsText || isLoading}
                        className="group flex flex-col items-end gap-8 disabled:opacity-5 transition-all"
                      >
                        <div className="w-28 h-28 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/80 group-hover:bg-white/10 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-700 backdrop-blur-sm">
                          <svg className="w-6 h-6 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <span className="text-[9px] uppercase tracking-[1.2em] font-extrabold text-white/60 group-hover:text-white transition-colors mr-[-1.2em]">Initiate Social Inference</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="h-[65vh] flex flex-col items-center justify-center">
                  <div className="w-96 h-[1px] bg-white/10 relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 h-full bg-white/80 animate-[loading_4s_infinite]"></div>
                  </div>
                  <p className="text-[10px] uppercase tracking-[1em] text-white font-bold ml-[1em] animate-pulse">
                    {loadingMessages[loadingStep]}
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-40 fade-in pb-48 relative" ref={reportRef}>
                  <div className="flex items-end justify-between border-b border-white/20 pb-20">
                    <div className="space-y-8">
                      <div className="flex items-center gap-12 group/title relative">
                        <h2 className="font-sans font-extrabold text-7xl text-white tracking-tighter leading-none uppercase drop-shadow-xl">
                          Social Reaction.<br /><span className="text-white/40">Simulation.</span>
                        </h2>
                        <div className="no-print no-export flex items-center gap-3 ml-6 self-end mb-1 opacity-70 group-hover/title:opacity-100 transition-opacity duration-500">
                           <button 
                             onClick={handleCopyReport}
                             className="px-4 py-2 border border-white/30 bg-white/10 hover:border-white hover:bg-white/20 transition-all rounded-sm text-[8px] font-black tracking-[0.2em] text-white hover:text-white uppercase flex items-center gap-2 backdrop-blur-md"
                           >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                             Copy
                           </button>
                        </div>
                        {copyFeedback && (
                          <div className="absolute -bottom-10 left-0 text-[7px] font-black tracking-[0.4em] text-white bg-black/80 px-3 py-1 animate-pulse no-export rounded-sm">
                            {copyFeedback}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right pb-2 space-y-3">
                      <div className="text-[11px] text-white font-mono tracking-[0.3em] font-bold border border-white/30 px-6 py-3 bg-white/10 backdrop-blur-md shadow-inner uppercase">{result.snapshotId}</div>
                      <div className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-extrabold">Temporal Lock: {todayStr}</div>
                    </div>
                  </div>

                  <div className="overflow-hidden border border-white/20 bg-black/30 backdrop-blur-md rounded-sm shadow-2xl">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        <tr>
                          <th className="w-56 p-8 text-[9px] uppercase tracking-[0.4em] text-white/50 font-extrabold border-r border-b border-white/10 bg-white/5 text-left">Subject Context</th>
                          <td className="p-8 text-[1.125rem] text-white border-b border-white/10 font-medium leading-relaxed italic">
                            {truncateText(activeParams?.newsText || '', 240)}
                          </td>
                        </tr>
                        <tr>
                          <th className="p-8 text-[9px] uppercase tracking-[0.4em] text-white/50 font-extrabold border-r border-b border-white/10 bg-white/5 text-left">Analytical Objective</th>
                          <td className="p-8 text-[1.125rem] text-white uppercase tracking-[0.3em] font-extrabold border-b border-white/10">
                            {activeParams?.purpose || 'EXPLORATORY ANALYSIS'}
                          </td>
                        </tr>
                        <tr>
                          <th className="p-8 text-[9px] uppercase tracking-[0.4em] text-white/50 font-extrabold border-r border-white/10 bg-white/5 text-left">Geo-Scope</th>
                          <td className="p-8 text-[1.125rem] text-white uppercase tracking-[0.3em] font-extrabold">
                            {activeParams?.region || 'NATIONAL (JP)'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="prose prose-invert prose-zinc max-w-none 
                    prose-h1:font-extrabold prose-h1:tracking-tighter prose-h1:uppercase prose-h1:text-white
                    prose-h2:font-extrabold prose-h2:tracking-tighter prose-h2:uppercase prose-h2:text-white
                    prose-h3:font-extrabold prose-h3:uppercase prose-h3:tracking-[0.35em] prose-h3:text-white/90
                    prose-th:font-extrabold prose-th:uppercase prose-th:tracking-[0.4em] prose-th:text-white/50
                    prose-strong:text-white prose-strong:font-extrabold
                    prose-li:text-white prose-li:text-[1.125rem]
                    prose-p:leading-[2.0] prose-p:text-white/90 prose-p:text-[1.125rem]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {result.rawText}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Deep Dive Protocol Section (Expanded) */}
                  <div className="mt-40 border-t border-white/20 pt-40">
                    <div className="flex items-center gap-8 mb-24">
                       <h3 className="font-sans font-extrabold text-7xl text-white tracking-tighter uppercase leading-none">
                         Deep Dive.<br/><span className="text-white/40">Protocol.</span>
                       </h3>
                    </div>
                    <p className="text-white/60 mb-16 text-lg font-light leading-relaxed max-w-2xl">
                      各セグメントの代表ペルソナに直接インタビューを行い、その深層心理と論理構造を解明します。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {['High (Strong Reaction)', 'Mid (Neutral)', 'Low (Indifferent)'].map((seg) => (
                         <button
                           key={seg}
                           onClick={() => openInterview(seg)}
                           className="group relative h-64 p-8 bg-white/5 border border-white/10 hover:border-white hover:bg-white/10 transition-all flex flex-col justify-between overflow-hidden text-left rounded-sm"
                         >
                           <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40"></div>
                           <div className="relative z-10">
                              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 block mb-4">Direct Link</span>
                              <span className="text-3xl font-black uppercase tracking-tighter text-white block">{seg.split(' ')[0]}</span>
                              <span className="text-sm font-light text-white/60 block mt-2">{seg.split('(')[1].replace(')', '')}</span>
                           </div>
                           <div className="relative z-10 flex justify-end">
                              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                              </div>
                           </div>
                         </button>
                      ))}
                    </div>
                  </div>

                  {result.groundingUrls && result.groundingUrls.length > 0 && (
                    <div className="mt-40 border-t border-white/20 pt-40">
                      <div className="flex items-center gap-8 mb-24">
                        <span className="text-[10px] uppercase tracking-[1.2em] font-extrabold text-white/40">Verified Evidence Registry</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {result.groundingUrls.map((url: any, i: number) => (
                          <a 
                            key={i} 
                            href={url.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group block space-y-8 p-12 hover:bg-white/10 transition-all rounded-sm border border-white/10 bg-black/20 hover:border-white/40 backdrop-blur-sm"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[8px] text-white/40 font-extrabold uppercase tracking-[0.4em] block">ID: EVIDENCE_LOCK_{i+1}</span>
                              <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <span className="text-[16px] font-bold text-white group-hover:text-white transition-colors block leading-relaxed tracking-tight italic">
                              {url.title && url.title.length > 100 ? url.title.substring(0, 100) + '...' : url.title}
                            </span>
                            <div className="text-[7px] text-white/30 font-mono break-all opacity-40">{url.uri}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-80 pb-40 no-print no-export">
                     <button 
                       onClick={handleInitialize}
                       className="text-[11px] uppercase tracking-[2.5em] font-extrabold text-white/50 hover:text-white transition-all ml-[2.5em] border-b border-transparent hover:border-white/30 pb-4"
                     >
                       Back to Control
                     </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Chat Overlay */}
      <div 
        className={`fixed inset-y-0 right-0 w-[480px] bg-[#050505] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-[100] transform transition-transform duration-500 ease-in-out flex flex-col ${chatSegment ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none"></div>
        
        {/* Chat Header */}
        <div className="p-8 border-b border-white/10 bg-white/[0.02] backdrop-blur-md relative z-10 flex justify-between items-start">
           <div className="space-y-2">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
               <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/60">Live Interview Session</span>
             </div>
             <h3 className="text-xl font-black text-white uppercase tracking-tighter">{chatSegment?.split(' ')[0]} Segment</h3>
             <p className="text-[10px] text-white/40 leading-relaxed max-w-[280px]">
               You are now speaking directly with a representative persona of this segment based on the DNA logic.
             </p>
           </div>
           <button 
             onClick={() => setChatSegment(null)}
             className="text-white/40 hover:text-white transition-colors p-2"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent" ref={chatContainerRef}>
           {chatMessages.map((msg, idx) => (
             <div key={idx} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`max-w-[85%] p-6 rounded-sm text-sm leading-relaxed ${
                 msg.role === 'user' 
                   ? 'bg-white/10 text-white border border-white/20' 
                   : 'bg-[#111] text-zinc-300 border border-white/5 shadow-xl'
               }`}>
                 {msg.text}
               </div>
               <span className="text-[8px] uppercase tracking-widest text-white/20 font-mono">{msg.timestamp}</span>
             </div>
           ))}
           {isChatLoading && (
             <div className="flex flex-col gap-2 items-start fade-in">
               <div className="bg-[#111] border border-white/5 p-6 rounded-sm flex items-center gap-4">
                 <div className="relative w-4 h-4">
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                 </div>
                 <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 animate-pulse">
                   Decoding Response...
                 </span>
               </div>
             </div>
           )}
        </div>

        {/* Chat Input */}
        <div className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="relative group">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 outline-none text-white text-sm p-4 h-24 resize-none placeholder:text-white/20 font-medium transition-all"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isChatLoading}
              className="absolute bottom-4 right-4 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { left: -100%; width: 30%; }
          50% { left: 35%; width: 40%; }
          100% { left: 100%; width: 30%; }
        }
        .sidebar-scroll::-webkit-scrollbar { width: 1px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .glass { background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(50px); }
        .bg-grid-white { background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E"); }
      `}</style>
    </div>
  );
};

export default App;
