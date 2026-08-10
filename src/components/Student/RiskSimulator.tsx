import React, { useState } from "react";
import { Sliders, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Subject } from "../../context/AcademicContext";

interface Props {
  subjects: Subject[];
  attendanceStats: any[];
  condonationLimit: string;
}

const RiskSimulator: React.FC<Props> = ({ subjects, attendanceStats, condonationLimit }) => {
  const [simSubject, setSimSubject] = useState<string>(subjects[0]?.code || "");
  const [extraAttend, setExtraAttend] = useState<number>(0);
  const [extraMiss, setExtraMiss] = useState<number>(0);

  const activeSimStat = attendanceStats.find(s => s.code === simSubject) || attendanceStats[0];
  const simHeld = (activeSimStat?.totalHeld || 0) + extraAttend + extraMiss;
  const simAttended = (activeSimStat?.attended || 0) + extraAttend;
  const simPercentage = simHeld === 0 ? 100 : Math.round((simAttended / simHeld) * 100);
  const simSafe = simPercentage >= Number(condonationLimit);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-border">
        <h3 className="text-base font-bold text-[#111827]">"What-If" Risk Predictor Engine</h3>
        <p className="text-xs text-muted mt-0.5">Calculate projected attendance percentages for upcoming weeks.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <div className="w-full sm:w-1/3 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-2">Select Subject to Simulate</label>
            <select value={simSubject} onChange={e => setSimSubject(e.target.value)} className="w-full p-3 rounded-lg border border-border bg-background text-xs font-bold outline-none cursor-pointer">
              {subjects.map((s,i) => <option key={i} value={s.code}>{s.title}</option>)}
            </select>
          </div>
          <div className="p-4 bg-background border border-border rounded-xl">
            <span className="block text-[10px] font-bold uppercase text-muted mb-1">Current Stats ({activeSimStat?.code})</span>
            <div className="flex justify-between items-center text-xs font-semibold mb-1"><span>Total Held:</span> <span className="font-mono">{activeSimStat?.totalHeld || 0}</span></div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1"><span>Total Attended:</span> <span className="font-mono text-emerald-600">{activeSimStat?.attended || 0}</span></div>
            <div className="flex justify-between items-center text-xs font-semibold"><span>Percentage:</span> <span className="font-bold text-primary">{activeSimStat?.percentage || 100}%</span></div>
          </div>
        </div>
        <div className="flex-1 space-y-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#111827] flex justify-between">
                <span>Future Attendance:</span><span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+{extraAttend} classes</span>
              </label>
              <input type="range" min="0" max="30" value={extraAttend} onChange={(e) => setExtraAttend(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#111827] flex justify-between">
                <span>Future Skips/Absences:</span><span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md">+{extraMiss} classes</span>
              </label>
              <input type="range" min="0" max="30" value={extraMiss} onChange={(e) => setExtraMiss(Number(e.target.value))} className="w-full accent-red-500 cursor-pointer" />
            </div>
          </div>
          <div className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all shadow-sm ${simSafe ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${simSafe ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                {simSafe ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
              </div>
              <div>
                <span className="block text-sm font-bold text-[#111827]">Simulated Outcome</span>
                <span className="text-xs font-semibold text-muted mt-0.5">Total classes in projection: {simHeld}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-extrabold block mb-1 ${simSafe ? "text-emerald-600" : "text-red-600"}`}>{simPercentage}%</span>
              <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${simSafe ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"}`}>
                {simSafe ? "Above Regulatory Barrier" : "Severe Shortage Alert"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RiskSimulator;
