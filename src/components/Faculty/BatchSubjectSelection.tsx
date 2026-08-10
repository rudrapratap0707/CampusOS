import React, { useState, useEffect } from "react";
import { BookOpen, Save, CheckSquare, Square } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

interface Props { selectedBatch: string; }

const BatchSubjectSelection: React.FC<Props> = ({ selectedBatch }) => {
  const { subjects, batches, batchSelectedSubjects, updateBatchSelectedSubjects } = useAcademic();
  
  const currentBatchObj = batches.find(b => b.name === selectedBatch);
  const batchDept = currentBatchObj?.dept || "";
  const currentSem = currentBatchObj?.currentSemester || 1;
  const semKey = `${selectedBatch}_${currentSem}`;

  const departmentSubjects = subjects.filter(sub => sub.dept === batchDept);
  const [localSelected, setLocalSelected] = useState<string[]>(batchSelectedSubjects[semKey] || []);

  useEffect(() => { setLocalSelected(batchSelectedSubjects[semKey] || []); }, [semKey, batchSelectedSubjects]);

  const toggleSubject = (code: string) => {
    setLocalSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handleSave = () => {
    updateBatchSelectedSubjects(selectedBatch, currentSem, localSelected);
    alert(`Curriculum subjects for ${selectedBatch} (Sem ${currentSem}) saved successfully! Next, go to Faculty Assignment.`);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary" size={24}/>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Curriculum Subject Selection <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
            <p className="text-[10px] text-muted uppercase tracking-wide font-semibold mt-1">Select subjects applicable for the current active semester</p>
          </div>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <Save size={16} /> Save Curriculum
        </button>
      </div>

      {departmentSubjects.length === 0 ? (
        <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-muted">
          No subjects found for <span className="font-bold">{batchDept}</span>. Please contact Admin.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentSubjects.map(sub => {
            const isSelected = localSelected.includes(sub.code);
            return (
              <div 
                key={sub.code} 
                onClick={() => toggleSubject(sub.code)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${isSelected ? 'bg-indigo-50 border-primary shadow-sm' : 'bg-background border-border hover:border-primary hover:shadow-sm'}`}
              >
                <div className={`mt-0.5 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div>
                  <span className={`font-mono font-bold text-xs ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{sub.code}</span>
                  <span className={`block text-[11px] font-semibold line-clamp-2 mt-1 ${isSelected ? 'text-indigo-700' : 'text-muted'}`}>{sub.title}</span>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-white/60 border border-slate-200 rounded text-[9px] font-bold text-slate-500">{sub.credits} Credits</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default BatchSubjectSelection;
