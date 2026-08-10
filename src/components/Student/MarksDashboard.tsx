import React, { useState, useEffect } from "react";
import { Award, BookOpen, Calculator, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Student, StudentMarkRecord, Subject, Batch } from "../../context/AcademicContext";

interface Props {
  currentStudent: Student;
  studentMarksDb: StudentMarkRecord[];
  subjects: Subject[];
  batches: Batch[];
  publishedBatches: { [key: string]: boolean };
}

const MarksDashboard: React.FC<Props> = ({ currentStudent, studentMarksDb, subjects, batches, publishedBatches }) => {
  const studentRecord = studentMarksDb.find(m => m.rollNo === currentStudent.rollNo);
  const history = studentRecord?.history || [];
  
  const getHistoricalBatchName = (currentName: string, targetSem: number) => {
    const lastDashIdx = currentName.lastIndexOf('-');
    if (lastDashIdx !== -1) {
      const prefix = currentName.substring(0, lastDashIdx);
      const numStr = currentName.substring(lastDashIdx + 1);
      if (numStr.length >= 2 && !isNaN(Number(numStr))) {
        const sectionDigit = numStr.substring(1);
        const targetYearDigit = Math.ceil(targetSem / 2);
        return `${prefix}-${targetYearDigit}${sectionDigit}`;
      }
    }
    return currentName;
  };

  const publishedHistory = history.filter(h => {
    const historicalBatchName = getHistoricalBatchName(currentStudent.batch, h.semester);
    return publishedBatches[`${historicalBatchName}_${h.semester}`] || publishedBatches[`${currentStudent.batch}_${h.semester}`];
  });

  const [selectedSem, setSelectedSem] = useState<number>(
    publishedHistory.length > 0 ? Math.max(...publishedHistory.map(h => h.semester)) : 1
  );

  // FIX: Force dropdown to update if a new semester result arrives live
  useEffect(() => {
    if (publishedHistory.length > 0) {
      const maxSem = Math.max(...publishedHistory.map(h => h.semester));
      if (!publishedHistory.some(h => h.semester === selectedSem) || maxSem > selectedSem) {
        setSelectedSem(maxSem);
      }
    }
  }, [publishedHistory, selectedSem]);

  if (publishedHistory.length === 0) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-xs text-center flex flex-col items-center justify-center animate-in fade-in mt-6">
        <FileText size={48} className="text-slate-300 mb-4"/>
        <h3 className="text-lg font-bold text-[#111827]">No Grade Cards Available</h3>
        <p className="text-sm text-muted mt-2">Your results have not been published by the administration yet.</p>
      </div>
    );
  }

  const currentSemData = publishedHistory.find(h => h.semester === selectedSem);
  const activeBacklogs = currentSemData?.backlogs || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2"><Award className="text-primary"/> Official Academic Transcript</h2>
          <p className="text-xs text-muted mt-1">Review your verified semester-wise performance and cumulative progression.</p>
        </div>
        <div className="flex items-center gap-3 bg-background p-2 rounded-xl border border-border shadow-inner">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Select Term</label>
          <select 
            value={selectedSem} 
            onChange={e => setSelectedSem(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-primary outline-none cursor-pointer focus:border-primary shadow-sm"
          >
            {publishedHistory.map(h => (
              <option key={h.semester} value={h.semester}>Semester {h.semester}</option>
            ))}
          </select>
        </div>
      </div>

      {activeBacklogs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20}/>
          <div>
            <h4 className="text-sm font-bold text-red-900">Active Backlogs Detected ({activeBacklogs.length})</h4>
            <p className="text-xs text-red-700 mt-1 font-medium">You have not secured passing grades in the following subjects for Semester {selectedSem}:</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {activeBacklogs.map(code => {
                const sub = subjects.find(s => s.code === code);
                return <span key={code} className="px-2.5 py-1 bg-white text-red-700 border border-red-200 rounded-lg font-mono text-[10px] font-bold shadow-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {code}: {sub?.title || "Unknown"}</span>
              })}
            </div>
            <p className="inline-block mt-3 px-2.5 py-1 bg-red-100 border border-red-200 rounded text-[10px] text-red-800 font-bold uppercase tracking-widest shadow-sm">Status: PCP (Promoted to Carry Paper)</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-sm border border-indigo-700 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-200">Term SGPA</p>
            <p className="text-4xl font-extrabold mt-1 tracking-tight">{currentSemData?.sgpa?.toFixed(2) || "0.00"}</p>
            <p className="text-[11px] text-indigo-200 mt-2 font-medium">Semester {selectedSem} Performance</p>
          </div>
          <Calculator className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500" size={120} />
        </div>
        
        <div className="bg-[#111827] text-white p-6 rounded-2xl shadow-sm border border-slate-800 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Cumulative CGPA</p>
            <p className="text-4xl font-extrabold mt-1 text-emerald-400 tracking-tight">{studentRecord?.cgpa?.toFixed(2) || "0.00"}</p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Overall Degree Average</p>
          </div>
          <Award className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-500" size={120} />
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Earned Credits (Sem {selectedSem})</p>
          <p className="text-3xl font-extrabold text-[#111827] mt-1 tracking-tight">{currentSemData?.totalCreditsEarned || 0}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <CheckCircle2 size={14} className="text-emerald-500"/> <span className="text-[11px] font-bold text-slate-600">Credits successfully secured</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="bg-slate-50 p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-slate-500"/>
            <h3 className="text-sm font-bold text-[#111827]">Semester {selectedSem} Detailed Breakdown</h3>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
            Enrolled as: {getHistoricalBatchName(currentStudent.batch, selectedSem)}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-background text-muted font-semibold">
              <tr>
                <th className="p-4 border-b border-border">Subject Code</th>
                <th className="p-4 border-b border-border">Subject Title</th>
                <th className="p-4 border-b border-border text-center">Credits</th>
                <th className="p-4 border-b border-border text-center bg-slate-50/50">CIA (40)</th>
                <th className="p-4 border-b border-border text-center bg-slate-50/50">ESE (60)</th>
                <th className="p-4 border-b border-border text-center">Total (100)</th>
                <th className="p-4 border-b border-border text-center">Grade Point</th>
                <th className="p-4 border-b border-border text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.keys(currentSemData?.marks || {}).map((code) => {
                const sub = subjects.find(s => s.code === code);
                const mark = currentSemData!.marks[code];
                const cia = mark.internalTest + mark.assignment + 10; 
                const total = cia + mark.ese;
                const credit = sub?.credits || 4;
                
                let gp = 0; let status = "FAIL"; let color = "text-red-700 bg-red-50 border-red-200 shadow-sm";
                if (total >= 90) { gp = 10; status = "O (Outstanding)"; color = "text-emerald-700 bg-emerald-50 border-emerald-200"; }
                else if (total >= 80) { gp = 9; status = "A+ (Excellent)"; color = "text-emerald-700 bg-emerald-50 border-emerald-200"; }
                else if (total >= 70) { gp = 8; status = "A (Very Good)"; color = "text-indigo-700 bg-indigo-50 border-indigo-200"; }
                else if (total >= 60) { gp = 7; status = "B+ (Good)"; color = "text-indigo-700 bg-indigo-50 border-indigo-200"; }
                else if (total >= 50) { gp = 6; status = "B (Above Average)"; color = "text-blue-700 bg-blue-50 border-blue-200"; }
                else if (total >= 40) { gp = 5; status = "C (Average)"; color = "text-amber-700 bg-amber-50 border-amber-200"; }
                
                return (
                  <tr key={code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700">{code}</td>
                    <td className="p-4 font-bold text-[#111827] max-w-[200px] truncate" title={sub?.title}>{sub?.title}</td>
                    <td className="p-4 text-center font-mono font-semibold text-slate-500">{credit}</td>
                    <td className="p-4 text-center font-mono bg-slate-50/30 text-slate-600">{cia}</td>
                    <td className="p-4 text-center font-mono bg-slate-50/30 text-slate-600">{mark.ese}</td>
                    <td className="p-4 text-center font-extrabold text-[#111827] text-sm">{total}</td>
                    <td className="p-4 text-center font-bold text-slate-800 text-sm">{gp}</td>
                    <td className="p-4 text-center"><span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border ${color}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs mt-8">
        <div className="bg-slate-800 p-4 border-b border-slate-700 text-white">
          <h3 className="text-sm font-bold flex items-center gap-2"><FileText size={16}/> Academic Progression Ledger</h3>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 text-muted font-semibold border-b border-border">
            <tr>
              <th className="p-4">Academic Term</th>
              <th className="p-4 text-center">Term SGPA</th>
              <th className="p-4 text-center">Credits Earned</th>
              <th className="p-4 text-center">Active Backlogs</th>
              <th className="p-4">Promotion Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {publishedHistory.map(h => (
              <tr key={h.semester} className={`transition-colors ${h.semester === selectedSem ? "bg-indigo-50/60" : "hover:bg-slate-50/50"}`}>
                <td className="p-4 font-bold text-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-2">Semester {h.semester} {h.semester === selectedSem && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}</div>
                  <span className="text-[10px] text-muted font-mono">{getHistoricalBatchName(currentStudent.batch, h.semester)}</span>
                </td>
                <td className="p-4 text-center font-mono font-extrabold text-primary text-sm">{h.sgpa.toFixed(2)}</td>
                <td className="p-4 text-center font-mono font-semibold">{h.totalCreditsEarned}</td>
                <td className="p-4 text-center font-mono font-bold text-red-500">{h.backlogs.length > 0 ? h.backlogs.length : "-"}</td>
                <td className="p-4 font-bold text-[10px] uppercase tracking-wider">
                  {h.backlogs.length > 0 ? (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded border border-amber-200">Promoted with Backlog</span>
                  ) : (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">Cleared Regular</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MarksDashboard;
