import React, { useState } from "react";
import { Student, StudentMarkRecord, Subject, useAcademic } from "../../context/AcademicContext";
import { CheckCircle2, ShieldCheck, Send, Eye, AlertTriangle } from "lucide-react";

interface Props {
  selectedBatch: string;
  batchStudents: Student[];
  studentMarksDb: StudentMarkRecord[];
  subjects: Subject[];
  submittedSubjects: { [key: string]: boolean };
  coordinatorApprovals: { [key: string]: boolean };
  forwardBatchToAdmin: (batch: string, semester: number) => void;
}

const SgpaControl: React.FC<Props> = ({ selectedBatch, batchStudents, studentMarksDb, subjects, submittedSubjects, coordinatorApprovals, forwardBatchToAdmin }) => {
  const { batchSelectedSubjects, batches } = useAcademic();
  
  const currentBatchObj = batches.find(b => b.name === selectedBatch);
  const currentSem = currentBatchObj?.currentSemester || 1;
  const semKey = `${selectedBatch}_${currentSem}`;
  
  const isBatchForwarded = coordinatorApprovals[semKey] || false;
  const selectedSubjectCodes = batchSelectedSubjects[semKey] || [];
  const curriculumSubjects = subjects.filter(sub => selectedSubjectCodes.includes(sub.code));

  const allSubjectsSubmitted = curriculumSubjects.length > 0 && curriculumSubjects.every(sub => submittedSubjects[`${selectedBatch}_${currentSem}_${sub.code}`]);

  const [previewSubject, setPreviewSubject] = useState<string | null>(null);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Batch Coordinator Verification ({selectedBatch}) <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
          <p className="text-xs text-muted mt-0.5">Preview subject marks submitted by faculties and forward the batch to Admin.</p>
        </div>
        <div>
          {isBatchForwarded ? (
            <span className="px-5 py-2.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-2">
              <ShieldCheck size={16}/> Forwarded to Admin (Pending Launch)
            </span>
          ) : (
            <button 
              onClick={() => {
                if (curriculumSubjects.length === 0) { alert("No subjects in curriculum! Please select subjects first."); return; }
                if (!allSubjectsSubmitted) { 
                  const confirm = window.confirm("Warning: Not all subject faculties have submitted their marks yet! Do you still want to forward to Admin?");
                  if (!confirm) return;
                }
                forwardBatchToAdmin(selectedBatch, currentSem);
                alert(`Batch ${selectedBatch} (Sem ${currentSem}) successfully verified and forwarded to Admin!`);
              }}
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all ${curriculumSubjects.length === 0 ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"}`}
            >
              <Send size={16}/> Verify & Forward to Admin
            </button>
          )}
        </div>
      </div>

      {curriculumSubjects.length === 0 ? (
        <div className="p-8 bg-amber-50 rounded-xl border border-dashed border-amber-300 text-center flex flex-col items-center justify-center">
          <AlertTriangle size={32} className="text-amber-400 mb-3" />
          <h4 className="font-bold text-amber-900 text-sm">Curriculum Not Defined</h4>
          <p className="text-xs text-amber-700 mt-1">Please go to 'Subject Selection' tab to configure the curriculum for this batch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculumSubjects.map(sub => {
            const isSubDone = submittedSubjects[`${selectedBatch}_${currentSem}_${sub.code}`];
            return (
              <div key={sub.code} className="p-4 rounded-xl bg-background border border-border flex flex-col gap-3 transition-all hover:border-primary/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-primary text-xs block">{sub.code}</span>
                    <span className="text-[11px] font-semibold text-[#111827] line-clamp-1">{sub.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${isSubDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {isSubDone ? "Submitted" : "Pending"}
                  </span>
                </div>
                <button onClick={() => setPreviewSubject(previewSubject === sub.code ? null : sub.code)} className="text-[11px] font-bold text-slate-500 hover:text-primary flex items-center gap-1 cursor-pointer w-fit">
                  <Eye size={12}/> {previewSubject === sub.code ? "Close Audit View" : "Preview Audit Roster"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {previewSubject && (
        <div className="border border-border rounded-xl overflow-hidden shadow-xs animate-in fade-in">
          <div className="bg-slate-800 p-3 text-white text-xs font-bold flex justify-between">
            <span>Audit Roster: {previewSubject}</span>
            <span className="text-slate-300">Read-Only Preview</span>
          </div>
          <table className="w-full text-left border-collapse text-xs bg-surface">
            <thead className="border-b border-border text-muted font-semibold bg-background">
              <tr>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 text-center">Internal (20)</th>
                <th className="p-3 text-center">Assign (10)</th>
                <th className="p-3 text-center">ESE (60)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batchStudents.map(st => {
                const semHistory = studentMarksDb.find(m => m.rollNo === st.rollNo)?.history.find(h => h.semester === currentSem);
                const subMark = semHistory?.marks[previewSubject] || { internalTest: 0, assignment: 0, ese: 0 };
                return (
                  <tr key={st.rollNo} className="hover:bg-background/50">
                    <td className="p-3 font-mono font-semibold">{st.rollNo}</td>
                    <td className="p-3 font-bold text-[#111827]">{st.firstName} {st.lastName}</td>
                    <td className="p-3 text-center font-mono">{subMark.internalTest}</td>
                    <td className="p-3 text-center font-mono">{subMark.assignment}</td>
                    <td className="p-3 text-center font-mono font-bold text-primary">{subMark.ese}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SgpaControl;
