/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { 
  AnalysisType, 
  generateAnalysis, 
  ProsConsResult, 
  ComparisonResult, 
  SWOTResult 
} from "./services/geminiService";
import { 
  ProsConsView, 
  ComparisonView, 
  SWOTView, 
  AnalysisLoader, 
  TypeSelector 
} from "./components/AnalysisComponents";

export default function App() {
  const [decision, setDecision] = useState("");
  const [type, setType] = useState<AnalysisType>(AnalysisType.PROS_CONS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProsConsResult | ComparisonResult | SWOTResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!decision.trim()) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await generateAnalysis(decision, type);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDecision("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-serif selection:bg-brand-dark selection:text-brand-bg">
      <div className="max-w-[1200px] mx-auto px-10 py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b-2 border-brand-dark pb-8 mb-12 gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-7xl md:text-8xl font-black tracking-tighter leading-none uppercase"
            >
              The Tie<br className="md:hidden" />breaker
            </motion.h1>
            <p className="text-xs font-sans tracking-[0.4em] uppercase mt-4 opacity-40 font-bold">
              AI-Powered Decision Resolution • Issue No. {Math.floor(Math.random() * 900) + 100}
            </p>
          </div>
          <div className="text-right w-full md:w-auto">
            <div className="text-3xl md:text-4xl font-bold italic tracking-tight serif line-clamp-1 max-w-sm ml-auto">
              {decision}
            </div>
            <div className="text-[10px] font-sans font-black uppercase tracking-widest bg-brand-dark text-brand-bg px-3 py-1 mt-3 inline-block ml-auto">
              Primary Analysis Module
            </div>
          </div>
        </header>

        <main className="min-h-[500px]">
          {/* Input Area */}
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div
                key="input-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-12"
              >
                <div className="md:col-span-8">
                  <div className="mb-12">
                    <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.25em] border-b border-brand-dark/10 pb-2 mb-6 opacity-60">The Subject of Inquiry</h2>
                    <textarea
                      id="decision-input"
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full h-48 bg-transparent text-3xl font-serif italic text-brand-dark placeholder:text-brand-dark/10 outline-none resize-none leading-relaxed border-l-4 border-brand-dark/5 pl-8"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button
                      id="analyze-button"
                      onClick={handleAnalyze}
                      disabled={!decision.trim()}
                      className="w-full sm:w-auto bg-brand-dark text-brand-bg font-sans font-black text-[12px] uppercase tracking-[0.3em] py-5 px-12 hover:opacity-90 disabled:opacity-10 transition-all flex items-center justify-center gap-3"
                    >
                      Process Decision
                      <ArrowRight size={16} />
                    </button>
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-30 max-w-[180px] leading-relaxed">
                      * Algorithmic weights applied via Gemini 3 Flash
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 border-l border-brand-dark/10 pl-8">
                  <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.25em] border-b border-brand-dark/10 pb-2 mb-6 opacity-60">Analysis Schema</h2>
                  <TypeSelector selected={type} onSelect={setType} />
                  
                  <div className="mt-12 p-6 border border-brand-dark border-dashed flex flex-col gap-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-50">Instruction</span>
                    <p className="text-sm font-bold leading-snug">Select a strategy from the matrix above to pivot the AI synthesis focus.</p>
                  </div>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisLoader />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-center border-b border-brand-dark/10 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-sans font-black uppercase tracking-widest px-2 py-1 border border-brand-dark bg-brand-dark text-brand-bg">Report Active</span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-40">Folio ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest hover:underline"
                  >
                    <RotateCcw size={12} />
                    Reset Console
                  </button>
                </div>

                {type === AnalysisType.PROS_CONS && <ProsConsView data={result as ProsConsResult} />}
                {type === AnalysisType.COMPARISON && <ComparisonView data={result as ComparisonResult} />}
                {type === AnalysisType.SWOT && <SWOTView data={result as SWOTResult} />}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 p-6 border border-rose-900/20 bg-rose-50 text-rose-900 text-xs font-sans font-bold uppercase tracking-widest text-center"
            >
              Synthesis Interrupted: {error}
            </motion.div>
          )}
        </main>

        <footer className="mt-20 flex flex-col md:flex-row justify-between items-center border-t border-brand-dark/10 pt-8 text-[10px] font-sans font-bold uppercase tracking-[0.3em] opacity-30 gap-4">
          <p>© {new Date().getFullYear()} The Tiebreaker Publication</p>
          <div className="flex gap-10">
            <span>Confidential Intelligence</span>
            <span>Prep by AI-Synthesist</span>
          </div>
          <p>Page 01 of 01</p>
        </footer>
      </div>
    </div>
  );
}

