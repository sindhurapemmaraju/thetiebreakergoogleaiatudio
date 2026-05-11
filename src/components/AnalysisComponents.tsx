import React from "react";
import { motion } from "motion/react";
import { Zap, ListChecks, Table as TableIcon, LayoutGrid } from "lucide-react";
import { AnalysisType, ProsConsResult, ComparisonResult, SWOTResult } from "../services/geminiService";

// --- Sub-components ---

const SectionTitle = ({ children, index, color }: { children: React.ReactNode, index: string, color?: string }) => (
  <div className="mb-4">
    <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] border-b border-brand-dark pb-1 mb-4 flex justify-between items-center">
      <span>{index}. {children}</span>
      {color && <div className={`h-2 w-2 rounded-full ${color}`} />}
    </h2>
  </div>
);

const ConclusionBox = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-12 bg-brand-dark text-brand-bg p-8 relative"
  >
    <div className="absolute top-0 left-8 transform -translate-y-1/2 bg-brand-bg text-brand-dark px-3 py-1 text-[10px] font-sans font-bold uppercase border border-brand-dark">
      Editorial Verdict
    </div>
    <div className="flex flex-col gap-4">
      <p className="text-xl serif italic leading-relaxed font-light">
        "{text}"
      </p>
      <div className="flex justify-between items-center border-t border-brand-bg/20 pt-4 mt-2">
        <span className="text-[9px] font-sans uppercase tracking-widest opacity-50">Prepared by The Tiebreaker AI Engine v4.2</span>
        <Zap size={14} className="opacity-30" />
      </div>
    </div>
  </motion.div>
);

// --- Main Views ---

export const ProsConsView = ({ data }: { data: ProsConsResult }) => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <SectionTitle index="01">The Assets</SectionTitle>
        <ul className="space-y-6">
          {data.pros.map((pro, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="text-[10px] font-sans font-bold uppercase text-emerald-700 tracking-wider mb-1">Affirmative</div>
              <p className="text-base leading-snug font-medium text-brand-dark">{pro}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <SectionTitle index="02">The Liabilities</SectionTitle>
        <ul className="space-y-6">
          {data.cons.map((con, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="text-[10px] font-sans font-bold uppercase text-rose-700 tracking-wider mb-1">Risk Factor</div>
              <p className="text-base leading-snug font-medium text-brand-dark">{con}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
    <ConclusionBox text={data.conclusion} />
  </div>
);

export const ComparisonView = ({ data }: { data: ComparisonResult }) => (
  <div className="space-y-12">
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-t-2 border-brand-dark pt-8"
    >
      <SectionTitle index="01">Comparative Matrix</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr>
              <th className="py-4 pr-4 text-[10px] font-sans font-bold uppercase tracking-widest text-brand-dark/40 border-b border-brand-dark/10">Parameters</th>
              {data.options.map((opt, i) => (
                <th key={i} className="py-4 px-4 text-sm font-black uppercase tracking-tight text-brand-dark border-b border-brand-dark">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/10">
            {data.criteria.map((criterion, i) => (
              <tr key={i} className="group hover:bg-brand-dark/[0.02] transition-colors">
                <td className="py-5 pr-4 text-xs font-sans font-bold uppercase tracking-wider text-brand-dark/60">{criterion.name}</td>
                {criterion.values.map((val, j) => (
                  <td key={j} className="py-5 px-4 text-sm text-brand-dark leading-relaxed font-serif italic">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
    <ConclusionBox text={data.conclusion} />
  </div>
);

export const SWOTView = ({ data }: { data: SWOTResult }) => (
  <div className="space-y-12">
    <SectionTitle index="01">Strategic Outlook</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 border border-brand-dark bg-brand-dark">
      {[
        { title: "Strengths", items: data.strengths, bg: "bg-[#FFFFFF]" },
        { title: "Weaknesses", items: data.weaknesses, bg: "bg-brand-bg" },
        { title: "Opportunities", items: data.opportunities, bg: "bg-brand-bg" },
        { title: "Threats", items: data.threats, bg: "bg-[#FFFFFF]" },
      ].map((section, idx) => (
        <motion.div 
          key={section.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className={`${section.bg} p-8 border-[0.5px] border-brand-dark min-h-[200px]`}
        >
          <span className="text-[10px] font-sans font-black uppercase tracking-tighter opacity-30 block mb-4 italic">{section.title}</span>
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-brand-dark leading-snug flex gap-2 font-medium">
                <span className="opacity-40">•</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
    <ConclusionBox text={data.conclusion} />
  </div>
);

export const AnalysisLoader = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-6">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="border-4 border-brand-dark border-t-transparent rounded-full w-12 h-12"
    />
    <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-brand-dark/40">Synthesizing Data Points...</p>
  </div>
);

export const TypeSelector = ({ selected, onSelect }: { selected: AnalysisType, onSelect: (t: AnalysisType) => void }) => {
  const types = [
    { id: AnalysisType.PROS_CONS, label: "The Weights", icon: ListChecks },
    { id: AnalysisType.COMPARISON, label: "The Matrix", icon: TableIcon },
    { id: AnalysisType.SWOT, label: "The Strategy", icon: LayoutGrid },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {types.map((type) => {
        const isActive = selected === type.id;
        return (
          <button
            key={type.id}
            id={`type-${type.id}`}
            onClick={() => onSelect(type.id)}
            className={`px-4 py-2 border transition-all duration-200 text-[10px] font-sans font-bold uppercase tracking-widest
              ${isActive 
                ? "bg-brand-dark text-brand-bg border-brand-dark" 
                : "bg-transparent text-brand-dark/60 border-brand-dark/20 hover:border-brand-dark hover:text-brand-dark"
              }`}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
};
