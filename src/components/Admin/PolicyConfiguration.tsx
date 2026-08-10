import React from "react";
import { Settings } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

const PolicyConfiguration: React.FC = () => {
  const { condonationLimit, setCondonationLimit, gradingMode, setGradingMode } = useAcademic();

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4 animate-in fade-in">
      <div className="flex items-center gap-2 text-sm font-bold text-[#111827] pb-2 border-b border-border">
        <Settings size={18} className="text-primary" />
        <span>Policy Engine & Institutional Settings</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-semibold text-muted block mb-2">Evaluation & Grading Mode</label>
          <select value={gradingMode} onChange={(e) => setGradingMode(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none cursor-pointer">
            <option>Absolute Grading (10-Point CBCS)</option>
            <option>Relative Grading Scale</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted block mb-2">Shortage Condonation Cutoff (%)</label>
          <input type="number" value={condonationLimit} onChange={(e) => setCondonationLimit(e.target.value)} className="w-full p-3 rounded-xl border border-border bg-background text-xs font-bold outline-none focus:border-primary" />
        </div>
      </div>
      <button onClick={() => alert("Policies committed successfully!")} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer">
        Deploy Settings Globally
      </button>
    </div>
  );
};
export default PolicyConfiguration;
