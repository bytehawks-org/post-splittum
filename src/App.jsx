import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  Copy, Check, Settings2, Scissors, Type, Hash, 
  ArrowDownCircle, RotateCcw, Loader2 
} from 'lucide-react';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [charLimit, setCharLimit] = useState(290);
  const [counterFormat, setCounterFormat] = useState('x/y');
  const [counterPos, setCounterPos] = useState('end');
  const [useEmojis, setUseEmojis] = useState(true);
  const [posts, setPosts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  
  // Meccanismo per aggiornamenti non bloccanti
  const [isPending, startTransition] = useTransition();

  const getCounterStr = (index, total) => {
    const formats = {
      'x/y': `${index + 1}/${total}`,
      '(x/y)': `(${index + 1}/${total})`,
      '[x/y]': `[${index + 1}/${total}]`
    };
    return formats[counterFormat] || formats['x/y'];
  };

  const splitText = useCallback(() => {
    if (!inputText.trim()) {
      setPosts([]);
      return;
    }

    const rawChunks = [];
    let textToProcess = inputText.trim();
    const metaBuffer = 25; 

    while (textToProcess.length > 0) {
      const effectiveLimit = charLimit - metaBuffer;
      if (textToProcess.length <= effectiveLimit) {
        rawChunks.push(textToProcess);
        break;
      }

      let splitAt = -1;
      const chunk = textToProcess.substring(0, effectiveLimit);
      const lastSentenceEnd = Math.max(chunk.lastIndexOf('. '), chunk.lastIndexOf('! '), chunk.lastIndexOf('? '));

      if (lastSentenceEnd !== -1 && lastSentenceEnd > effectiveLimit * 0.5) {
        splitAt = lastSentenceEnd + 1;
      } else {
        const lastSpace = chunk.lastIndexOf(' ');
        splitAt = (lastSpace !== -1 && lastSpace > effectiveLimit * 0.8) ? lastSpace : effectiveLimit - 5;
      }

      let content = textToProcess.substring(0, splitAt).trim();
      const specialPunct = /[,;:]$/;
      
      if (!/[.!?]$/.test(content)) {
        // Logica: spazio prima di ... se c'è punteggiatura diversa dal punto
        content += specialPunct.test(content) ? ' ...' : '...';
        textToProcess = '...' + textToProcess.substring(splitAt).trim();
      } else {
        textToProcess = textToProcess.substring(splitAt).trim();
      }
      rawChunks.push(content);
    }

    const finalized = rawChunks.map((content, idx) => {
      const counter = getCounterStr(idx, rawChunks.length);
      const emoji = useEmojis ? (idx === rawChunks.length - 1 ? ' ⏹️' : ' ⬇️') : '';
      return {
        id: `post-${idx}`,
        content: counterPos === 'start' ? `${counter} ${content}${emoji}` : `${content}${emoji} ${counter}`
      };
    });

    setPosts(finalized);
  }, [inputText, charLimit, counterFormat, counterPos, useEmojis]);

  // Ricalcolo con debounce e non-blocking transition
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        splitText();
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [inputText, charLimit, counterFormat, counterPos, useEmojis, splitText]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#0085FF] p-1.5 rounded-lg">
              <Scissors className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tight italic">Post<span className="text-[#0085FF]">Splittum</span></h1>
            {isPending && <Loader2 size={14} className="animate-spin text-[#0085FF] ml-2" />}
          </div>
          <button onClick={() => setInputText('')} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1">
            <RotateCcw size={12} /> Clear
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
        
        {/* COLONNA SINISTRA: INPUT & CONTROLLI */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-20 lg:h-[calc(100vh-100px)] flex flex-col gap-4">
          
          <section className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-black text-[10px] text-slate-400 uppercase tracking-widest">
              <Settings2 size={14} className="text-[#0085FF]" /> Configurazione
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Max Chars</label>
                <input 
                  type="number" 
                  value={charLimit} 
                  onChange={(e) => setCharLimit(parseInt(e.target.value) || 290)} 
                  className="w-full bg-slate-50 border-none rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-[#0085FF]" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Formato</label>
                <select 
                  value={counterFormat} 
                  onChange={(e) => setCounterFormat(e.target.value)} 
                  className="w-full bg-slate-50 border-none rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-[#0085FF] appearance-none"
                >
                  <option value="x/y">1/n</option>
                  <option value="(x/y)">(1/n)</option>
                  <option value="[x/y]">[1/n]</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex bg-slate-100 p-1 rounded-full shrink-0">
                {['start', 'end'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setCounterPos(p)} 
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${counterPos === p ? 'bg-white text-[#0085FF] shadow-sm' : 'text-slate-500'}`}
                  >
                    {p === 'start' ? 'INIZIO' : 'FINE'}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setUseEmojis(!useEmojis)} 
                className={`flex-grow py-2 rounded-xl text-[10px] font-black transition-all border-2 ${useEmojis ? 'bg-blue-50 border-[#0085FF] text-[#0085FF]' : 'bg-white border-slate-200 text-slate-400'}`}
              >
                EMOJI {useEmojis ? 'ON' : 'OFF'}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex-grow flex flex-col overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Incolla il testo..."
              className="w-full flex-grow p-6 text-slate-700 placeholder:text-slate-300 focus:ring-0 border-none resize-none text-[15px] leading-relaxed bg-transparent font-medium"
            />
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Input: {inputText.length} ch</span>
              <span className={isPending ? "text-orange-400" : "text-[#0085FF]"}>
                {isPending ? "Calcolo..." : `${posts.length} Post`}
              </span>
            </div>
          </section>
        </div>

        {/* COLONNA DESTRA: BALLOONS */}
        <div className="w-full lg:w-[60%] space-y-5">
          <div className="flex items-center gap-2 px-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <ArrowDownCircle size={14} /> Preview Thread
          </div>

          <div className="space-y-6 pb-20">
            {posts.map((post, idx) => {
              const isOver = post.content.length > charLimit;
              return (
                <div key={post.id} className="relative flex gap-3 group">
                  {idx < posts.length - 1 && <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-slate-200" />}
                  
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-[10px] font-black text-[#0085FF] shrink-0 shadow-sm z-10">
                    {idx + 1}
                  </div>

                  <div className={`flex-1 bg-white p-5 rounded-[2.5rem] rounded-tl-none border shadow-sm transition-all ${isOver ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 hover:border-blue-200'}`}>
                    <textarea
                      value={post.content}
                      onChange={(e) => {
                        const newPosts = [...posts];
                        newPosts[idx].content = e.target.value;
                        setPosts(newPosts);
                      }}
                      rows={6} // Ingrandito per permettere lettura fino a 300ch
                      className="w-full p-0 border-none focus:ring-0 text-slate-800 leading-relaxed resize-none bg-transparent text-[15px] font-medium"
                    />
                    
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${isOver ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {post.content.length} / {charLimit}
                      </div>
                      
                      <button 
                        onClick={() => copyToClipboard(post.content, post.id)} 
                        className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-black transition-all ${
                          copiedId === post.id ? 'bg-green-500 text-white' : 'bg-[#0085FF] text-white hover:bg-slate-900'
                        }`}
                      >
                        {copiedId === post.id ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === post.id ? 'COPIATO' : 'COPIA'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {posts.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-300">
                <p className="font-bold uppercase tracking-widest text-[10px]">Incolla il testo per generare i balloon</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
