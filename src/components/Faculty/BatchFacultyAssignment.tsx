import React, { useState, useEffect } from "react";
import { Network, Save, AlertTriangle } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

interface Props { selectedBatch: string; }

const BatchFacultyAssignment: React.FC<Props> = ({ selectedBatch }) => {
  const { subjects, faculties, batches, batchSelectedSubjects, batchSubjectAssignments, updateBatchSubjectAssignments } = useAcademic();
  
  const currentBatchObj = batches.find(b => b.name === selectedBatch);
  const batchDept = currentBatchObj?.dept || "";
  const currentSem = currentBatchObj?.currentSemester || 1;
  const semKey = `${selectedBatch}_${currentSem}`;
  
  const selectedSubjectCodes = batchSelectedSubjects[semKey] || [];
  const curriculumSubjects = subjects.filter(sub => selectedSubjectCodes.includes(sub.code));
  const departmentFaculties = faculties.filter(fac => fac.dept === batchDept);

  const [localAssignments, setLocalAssignments] = useState<{ [subjectCode: string]: string }>(batchSubjectAssignments[semKey] || {});

  useEffect(() => { setLocalAssignments(batchSubjectAssignments[semKey] || {}); }, [semKey, batchSubjectAssignments]);

  const handleAssignmentChange = (subCode: string, email: string) => { setLocalAssignments(prev => ({ ...prev, [subCode]: email })); };

  const handleSaveAssignments = () => {
    updateBatchSubjectAssignments(selectedBatch, currentSem, localAssignments);
    alert(`Subject-Faculty assignments for ${selectedBatch} (Sem ${currentSem}) successfully locked!`);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <Network className="text-primary" size={24}/>
          <div>
            <h3 className="text-base font-bold text-[#111827]">Faculty Assignment Engine <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
            <p className="text-[10px] text-muted uppercase tracking-wide font-semibold mt-1">Assign department faculty to active semester subjects</p>
          </div>
        </div>
        <button onClick={handleSaveAssignments} className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <Save size={16} /> Lock Assignments
        </button>
      </div>

      {selectedSubjectCodes.length === 0 ? (
        <div className="p-8 bg-amber-50 rounded-xl border border-dashed border-amber-300 text-center flex flex-col items-center justify-center">
          <AlertTriangle size={32} className="text-amber-400 mb-3" />
          <h4 className="font-bold text-amber-900 text-sm">No Curriculum Selected for Sem {currentSem}</h4>
          <p className="text-xs text-amber-700 mt-1">Please go to 'Subject Selection' tab first to build the curriculum for the current semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculumSubjects.map(sub => (
            <div key={sub.code} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 transition-all hover:border-primary">
              <div>
                <span className="font-mono font-bold text-primary text-xs">{sub.code}</span>
                <span className="block text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{sub.title}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <select 
                  value={localAssignments[sub.code] || ""} 
                  onChange={(e) => handleAssignmentChange(sub.code, e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:border-primary cursor-pointer text-slate-700 font-semibold bg-slate-50"
                >
                  <option value="">-- Assign Faculty --</option>
                  {departmentFaculties.map(fac => (
                    <option key={fac.id} value={fac.email}>{fac.firstName} {fac.lastName} ({fac.email})</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BatchFacultyAssignment;
