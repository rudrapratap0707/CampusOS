import React, { useState } from "react";
import { DatabaseZap, Send, Lock, Unlock } from "lucide-react";
import { Student, StudentMarkRecord, Subject, AttendanceRecord, Batch, useAcademic } from "../../context/AcademicContext";

interface Props {
  selectedBatch: string;
  selectedSubject: string;
  batchStudents: Student[];
  studentMarksDb: StudentMarkRecord[];
  subjects: Subject[];
  batches: Batch[];
  attendanceRecords: AttendanceRecord[];
  saveSubjectInternalAndEse: (rollNo: string, batch: string, semester: number, subjectCode: string, internalTest: number, assignment: number, ese: number) => void;
  submittedSubjects: { [key: string]: boolean };
  submitSubjectToCoordinator: (batch: string, semester: number, subjectCode: string) => void;
}

const CieMatrix: React.FC<Props> = ({ 
  selectedBatch, selectedSubject, batchStudents, studentMarksDb, 
  batches, attendanceRecords, saveSubjectInternalAndEse, 
  submittedSubjects = {}, submitSubjectToCoordinator 
}) => {
  const { showToast, showConfirm } = useAcademic(); // USING CUSTOM ENGINE
  
  const currentBatchObj = batches.find(b => b.name === selectedBatch);
  const currentSem = currentBatchObj?.currentSemester || 1;
  const subjectCode = selectedSubject.split(":")[0].trim();
  
  const subKey = `${selectedBatch}_${currentSem}_${subjectCode}`;
  const isSubmitted = submittedSubjects[subKey] || false;

  const [lockedRows, setLockedRows] = useState<{ [rollNo: string]: boolean }>({});

  const handleInputChange = (rollNo: string, field: "internalTest" | "assignment" | "ese", valStr: string) => {
    if (isSubmitted || lockedRows[rollNo]) return;
    
    let val = parseInt(valStr) || 0;
    if (field === "internalTest" && val > 20) val = 20;
    if (field === "assignment" && val > 10) val = 10;
    if (field === "ese" && val > 60) val = 60;
    if (val < 0) val = 0;

    const studentRec = studentMarksDb.find(m => m.rollNo === rollNo);
    const semHistory = studentRec?.history.find(h => h.semester === currentSem);
    const existingSubMark = semHistory?.marks[subjectCode] || { internalTest: 0, assignment: 0, ese: 0 };

    const internalTest = field === "internalTest" ? val : existingSubMark.internalTest;
    const assignment = field === "assignment" ? val : existingSubMark.assignment;
    const ese = field === "ese" ? val : existingSubMark.ese;

    saveSubjectInternalAndEse(rollNo, selectedBatch, currentSem, subjectCode, internalTest, assignment, ese);
  };

  const toggleRowLock = (rollNo: string) => {
    if (isSubmitted) return;
    setLockedRows(prev => ({ ...prev, [rollNo]: !prev[rollNo] }));
  };

  const lockedCount = Object.values(lockedRows).filter(Boolean).length;

  const handleFinalSubmit = () => {
    const executeSubmit = () => {
      submitSubjectToCoordinator(selectedBatch, currentSem, subjectCode);
      showToast("success", "Matrix Locked", `Marks for ${subjectCode} successfully submitted to the Coordinator!`);
    };

    if (lockedCount < batchStudents.length) {
      // Async Custom Dialog instead of window.confirm
      showConfirm(
        "Incomplete Evaluation", 
        `You have only verified & locked ${lockedCount} out of ${batchStudents.length} records. Are you sure you want to Final Submit?`, 
        executeSubmit
      );
    } else {
      executeSubmit();
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col xl:flex-row justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Subject Evaluation Portal: {selectedSubject} <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
          <p className="text-xs text-muted mt-0.5">Internal Test (20) + Assignment (10) + Auto Attendance (10) = CIA Total (40). ESE External (60).</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200">
            Progress: <span className="text-primary">{isSubmitted ? batchStudents.length : lockedCount}</span> / {batchStudents.length} Evaluated
          </div>

          {isSubmitted ? (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300">
              Submitted to Coordinator
            </span>
          ) : (
            <button 
              onClick={handleFinalSubmit}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Send size={14}/> Final Submit to Coordinator
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <DatabaseZap size={14} className="animate-pulse" /> Live DB Sync
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-background border-b border-border text-muted font-semibold">
            <tr>
              <th className="p-4">Roll Number</th>
              <th className="p-4">Student Name</th>
              <th className="p-4 text-center">Internal (20)</th>
              <th className="p-4 text-center">Assignment (10)</th>
              <th className="p-4 text-center">Auto Att. (10)</th>
              <th className="p-4 text-center">CIA Total (40)</th>
              <th className="p-4 text-center">ESE External (60)</th>
              <th className="p-4 text-center">Final Score (100)</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {batchStudents.length === 0 ? (
              <tr><td colSpan={9} className="p-8 text-center text-muted">No students found in this batch.</td></tr>
            ) : (
              batchStudents.map((st) => {
                const studentRec = studentMarksDb.find(m => m.rollNo === st.rollNo);
                const semHistory = studentRec?.history.find(h => h.semester === currentSem);
                const subMark = semHistory?.marks[subjectCode] || { internalTest: 0, assignment: 0, ese: 0 };
                
                const subRecords = attendanceRecords.filter(r => r.batch === selectedBatch && (r.semester || 1) === currentSem && r.subject.includes(subjectCode));
                const totalHeld = subRecords.length;
                const attended = subRecords.filter(r => {
                  const stRec = r.records.find(sr => sr.rollNo === st.rollNo);
                  return stRec && stRec.status === "Present";
                }).length;
                const attPct = totalHeld === 0 ? 100 : Math.round((attended / totalHeld) * 100);

                let attMark = 0;
                if (attPct >= 90) attMark = 10; else if (attPct >= 85) attMark = 9; else if (attPct >= 80) attMark = 8; else if (attPct >= 75) attMark = 7; else if (attPct >= 70) attMark = 6; else if (attPct >= 65) attMark = 5; else attMark = Math.max(Math.round((attPct / 65) * 5), 0);

                const totalCia = subMark.internalTest + subMark.assignment + attMark;
                const finalScore = totalCia + subMark.ese;
                const isRowLocked = isSubmitted || lockedRows[st.rollNo];

                return (
                  <tr key={st.rollNo} className={`transition-colors ${lockedRows[st.rollNo] && !isSubmitted ? "bg-emerald-50/50" : "hover:bg-background/50"}`}>
                    <td className="p-4 font-mono font-semibold">{st.rollNo}</td>
                    <td className="p-4 font-bold text-[#111827]">{st.firstName} {st.lastName}</td>
                    <td className="p-4 text-center"><input type="number" min="0" max="20" placeholder="0" disabled={isRowLocked} value={subMark.internalTest === 0 ? "" : subMark.internalTest} onChange={(e) => handleInputChange(st.rollNo, "internalTest", e.target.value)} className="w-14 p-2 rounded-lg border border-border bg-white text-xs font-bold text-center outline-none focus:border-primary shadow-inner disabled:opacity-50 disabled:bg-slate-100" /></td>
                    <td className="p-4 text-center"><input type="number" min="0" max="10" placeholder="0" disabled={isRowLocked} value={subMark.assignment === 0 ? "" : subMark.assignment} onChange={(e) => handleInputChange(st.rollNo, "assignment", e.target.value)} className="w-14 p-2 rounded-lg border border-border bg-white text-xs font-bold text-center outline-none focus:border-primary shadow-inner disabled:opacity-50 disabled:bg-slate-100" /></td>
                    <td className="p-4 text-center"><div className="flex flex-col items-center"><span className="font-bold text-emerald-600">{attMark}</span><span className="text-[9px] text-muted">{attPct}% Att.</span></div></td>
                    <td className="p-4 font-bold text-indigo-600 text-center">{totalCia}</td>
                    <td className="p-4 text-center"><input type="number" min="0" max="60" placeholder="0" disabled={isRowLocked} value={subMark.ese === 0 ? "" : subMark.ese} onChange={(e) => handleInputChange(st.rollNo, "ese", e.target.value)} className="w-14 p-2 rounded-lg border border-border bg-white text-xs font-bold text-center outline-none focus:border-primary shadow-inner disabled:opacity-50 disabled:bg-slate-100" /></td>
                    <td className="p-4 font-extrabold text-primary text-sm text-center">{finalScore}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleRowLock(st.rollNo)} disabled={isSubmitted} title={isRowLocked ? "Unlock Row" : "Lock Row"} className={`p-2 rounded-lg transition-all cursor-pointer ${isSubmitted ? "text-slate-400 cursor-not-allowed" : isRowLocked ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                        {isRowLocked ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CieMatrix;
