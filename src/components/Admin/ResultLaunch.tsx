import React, { useState } from "react";
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, Send, Trash2, Edit3, Rocket, ArrowUpRight, X, Sparkles, Trash } from "lucide-react";
import { useAcademic, Batch } from "../../context/AcademicContext";

const ResultLaunch: React.FC = () => {
  const { 
    batches, subjects, students, studentMarksDb, saveSubjectInternalAndEse, faculties,
    coordinatorApprovals, publishedBatches, batchSelectedSubjects, promoteBatch,
    adminPublishBatchResult, adminUnpublishBatchResult,
    showToast, showConfirm // IMPORTED CUSTOM ENGINE
  } = useAcademic();

  const [activeBatch, setActiveBatch] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState<string>("");

  const [promotingBatch, setPromotingBatch] = useState<Batch | null>(null);
  const [newCoordinatorEmail, setNewCoordinatorEmail] = useState("");

  const handleBulkLaunch = () => {
    let launchedCount = 0;
    batches.forEach(batch => {
      const semKey = `${batch.name}_${batch.currentSemester}`;
      if (coordinatorApprovals[semKey] && !publishedBatches[semKey]) {
        adminPublishBatchResult(batch.name, batch.currentSemester);
        launchedCount++;
      }
    });
    if (launchedCount > 0) {
      showToast("success", "Bulk Launch Success", `${launchedCount} Batch(es) successfully published live!`);
    } else {
      showToast("warning", "No Pending Action", "No pending batches are ready for bulk launch.");
    }
  };

  const executePromotion = () => {
    if (!promotingBatch || !newCoordinatorEmail) {
      showToast("error", "Missing Details", "Please select a coordinator for the new semester.");
      return;
    }
    promoteBatch(promotingBatch.name, newCoordinatorEmail);
    showToast("success", "Promotion Executed", `Batch successfully promoted to Sem ${promotingBatch.currentSemester + 1}!`);
    setPromotingBatch(null);
  };

  // 🔥 NEW FUNCTION: Hard Delete Result for a Batch's current semester
  const handleDeleteResult = (batchName: string, semester: number) => {
    showConfirm(
      "DANGER: Delete Result?", 
      `Are you ABSOLUTELY SURE you want to DELETE ALL MARKS for ${batchName} (Sem ${semester})? This action cannot be undone and will reset their grades for this semester.`, 
      () => {
        const batchStudents = students.filter(s => s.batch === batchName);
        let deletedCount = 0;

        batchStudents.forEach(st => {
          const semKey = `${batchName}_${semester}`;
          const activeSubjectCodes = batchSelectedSubjects[semKey] || [];
          
          activeSubjectCodes.forEach(subCode => {
            // Setting marks to 0 effectively wipes them. 
            // Depending on your Context implementation, you might have a dedicated delete function,
            // but this safely overwrites it to 0.
            saveSubjectInternalAndEse(st.rollNo, batchName, semester, subCode, 0, 0, 0);
          });
          deletedCount++;
        });

        // Also Unpublish and Revoke Coordinator approval if you have setters for them in Context
        adminUnpublishBatchResult(batchName, semester); 
        
        showToast("success", "Result Deleted", `Marks for ${deletedCount} students in ${batchName} have been wiped.`);
      }
    );
  };

  if (activeBatch) {
    const activeBatchObj = batches.find(b => b.name === activeBatch);
    if (!activeBatchObj) {
        setActiveBatch(null);
        return null;
    }
    const currentSem = activeBatchObj.currentSemester || 1;
    const semKey = `${activeBatch}_${currentSem}`;
    const isPublished = publishedBatches[semKey] || false;
    const batchStudents = students.filter(s => s.batch === activeBatch);
    const activeSubjectCodes = batchSelectedSubjects[semKey] || [];
    const curriculumSubjects = subjects.filter(s => activeSubjectCodes.includes(s.code));
    const safeSubject = editSubject || (curriculumSubjects[0] ? curriculumSubjects[0].code : "");

    return (
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
          <div>
            <button onClick={() => setActiveBatch(null)} className="text-xs font-bold text-primary mb-2 hover:underline cursor-pointer">&larr; Back to Batches</button>
            <h3 className="text-base font-bold text-[#111827]">Result Management: {activeBatch} <span className="bg-slate-100 px-2 py-1 rounded text-xs ml-2 text-slate-600">Sem {currentSem}</span></h3>
            <p className="text-xs text-muted mt-0.5">Review, Edit individual marks, and Publish/Unpublish Results for the active semester.</p>
          </div>
          <div className="flex gap-3">
            {isPublished ? (
              <button 
                onClick={() => {
                  showConfirm("Unpublish Result?", `Are you sure you want to unpublish the result for ${activeBatch}? Students will lose access to this Grade Card.`, () => {
                    adminUnpublishBatchResult(activeBatch, currentSem); 
                    showToast("info", "Result Unpublished", "The result has been withdrawn from the student portal.");
                  });
                }} 
                className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Trash2 size={14}/> Unpublish Result
              </button>
            ) : (
              <button 
                onClick={() => { 
                  adminPublishBatchResult(activeBatch, currentSem); 
                  showToast("success", "Result Published", "Result published live! SGPA/CGPA dynamically recalculated."); 
                }} 
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Send size={14}/> Publish & Recalculate SGPA
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-background border border-border rounded-xl flex items-center gap-4">
          <label className="text-xs font-bold text-slate-700">Select Subject to Edit:</label>
          <select value={safeSubject} onChange={e => setEditSubject(e.target.value)} className="p-2 rounded-lg border border-border text-xs outline-none focus:border-primary cursor-pointer">
            {curriculumSubjects.length === 0 && <option value="">-- No Curriculum Defined --</option>}
            {curriculumSubjects.map(sub => <option key={sub.code} value={sub.code}>{sub.code}: {sub.title}</option>)}
          </select>
        </div>

        <div className="border border-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-800 text-white font-semibold">
              <tr>
                <th className="p-3">Roll No</th><th className="p-3">Student Name</th><th className="p-3 text-center">Internal (20)</th><th className="p-3 text-center">Assign (10)</th><th className="p-3 text-center">ESE (60)</th><th className="p-3 text-center">SGPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {batchStudents.map(st => {
                const studentRec = studentMarksDb.find(m => m.rollNo === st.rollNo);
                const semHistory = studentRec?.history.find(h => h.semester === currentSem);
                const subMark = semHistory?.marks[safeSubject] || { subjectCode: safeSubject, internalTest: 0, assignment: 0, ese: 0 };
                const sgpa = semHistory?.sgpa;
                
                return (
                  <tr key={st.rollNo} className="hover:bg-background/50">
                    <td className="p-3 font-mono font-semibold">{st.rollNo}</td>
                    <td className="p-3 font-bold text-[#111827]">{st.firstName} {st.lastName}</td>
                    <td className="p-3 text-center"><input type="number" min="0" max="20" value={subMark.internalTest} onChange={(e) => saveSubjectInternalAndEse(st.rollNo, activeBatch, currentSem, safeSubject, Number(e.target.value)||0, subMark.assignment, subMark.ese)} className="w-16 p-1.5 border border-border rounded text-center outline-none" /></td>
                    <td className="p-3 text-center"><input type="number" min="0" max="10" value={subMark.assignment} onChange={(e) => saveSubjectInternalAndEse(st.rollNo, activeBatch, currentSem, safeSubject, subMark.internalTest, Number(e.target.value)||0, subMark.ese)} className="w-16 p-1.5 border border-border rounded text-center outline-none" /></td>
                    <td className="p-3 text-center"><input type="number" min="0" max="60" value={subMark.ese} onChange={(e) => saveSubjectInternalAndEse(st.rollNo, activeBatch, currentSem, safeSubject, subMark.internalTest, subMark.assignment, Number(e.target.value)||0)} className="w-16 p-1.5 border border-border rounded text-center outline-none font-bold text-primary" /></td>
                    <td className="p-3 text-center font-extrabold text-indigo-700">{sgpa ? sgpa.toFixed(2) : "-"}</td>
                  </tr>
                );
              })}
              {batchStudents.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted">No students enrolled.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const readyBatchCount = batches.filter(b => coordinatorApprovals[`${b.name}_${b.currentSemester}`] && !publishedBatches[`${b.name}_${b.currentSemester}`]).length;

  let nextSem = 1;
  let nextBatchName = "";
  let isYearChange = false;

  if (promotingBatch) {
    nextSem = promotingBatch.currentSemester + 1;
    nextBatchName = promotingBatch.name;

    if (nextSem % 2 !== 0) {
      const lastDashIdx = promotingBatch.name.lastIndexOf('-');
      if (lastDashIdx !== -1) {
        const prefix = promotingBatch.name.substring(0, lastDashIdx);
        const numStr = promotingBatch.name.substring(lastDashIdx + 1);
        if (numStr.length >= 2 && !isNaN(Number(numStr))) {
          const yearDigit = parseInt(numStr.charAt(0));
          const sectionDigit = numStr.substring(1);
          nextBatchName = `${prefix}-${yearDigit + 1}${sectionDigit}`;
          isYearChange = true;
        }
      }
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-6 animate-in fade-in relative">
      
      {promotingBatch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><ArrowUpRight size={20}/> Batch Promotion Setup</h3>
                <p className="text-indigo-200 text-xs font-medium">Elevating to Semester {nextSem}</p>
              </div>
              <button onClick={() => setPromotingBatch(null)} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-4">
              {isYearChange && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 shadow-sm animate-in zoom-in-95">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-700 mb-1.5"><Sparkles size={16}/> Academic Year Transition Detected!</p>
                  <p>The system will automatically rename this batch from <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-slate-700">{promotingBatch.name}</span> to <span className="font-mono font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow-sm">{nextBatchName}</span>. All students and records will be securely migrated.</p>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                <p className="font-bold mb-1 text-slate-800">Standard Promotion Actions:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Semester {promotingBatch.currentSemester} records will be archived into Grade Cards.</li>
                  <li>A fresh academic workspace will be generated for Sem {nextSem}.</li>
                </ul>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Assign Batch Coordinator for Sem {nextSem}</label>
                <select value={newCoordinatorEmail} onChange={e => setNewCoordinatorEmail(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-600 text-sm">
                  {faculties.map(f => <option key={f.id} value={f.email}>{f.firstName} {f.lastName} ({f.email})</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setPromotingBatch(null)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors">Cancel</button>
                <button onClick={executePromotion} className="flex-1 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2">Execute Promotion <ArrowUpRight size={16}/></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
          <Award size={18} className="text-primary" /> <span>Final Result Launch & Promotion Control</span>
        </div>
        <button onClick={handleBulkLaunch} disabled={readyBatchCount === 0} className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${readyBatchCount > 0 ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
          <Rocket size={16}/> Launch All Ready Batches ({readyBatchCount})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {batches.map((batch, idx) => {
          const semKey = `${batch.name}_${batch.currentSemester}`;
          const isForwarded = coordinatorApprovals[semKey] || false;
          const isPublished = publishedBatches[semKey] || false;

          return (
            <div key={idx} className="p-5 rounded-xl bg-background border border-border flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shadow-xs hover:border-indigo-300 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-[#111827] uppercase">{batch.name}</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">Sem {batch.currentSemester}</span>
                  <span className="text-xs text-muted">[{batch.dept}]</span>
                </div>
                <p className="text-xs text-muted mt-1">Batch Coordinator: <span className="font-semibold text-[#111827]">{batch.coordinator}</span></p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isForwarded ? (
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5"><AlertTriangle size={14}/> Waiting for Coordinator</span>
                ) : isPublished ? (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5"><CheckCircle2 size={14}/> Published Live</span>
                ) : (
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5"><ShieldCheck size={14}/> Ready for Launch</span>
                )}
                
                {isForwarded && !isPublished && (
                  <button 
                    onClick={() => { 
                      adminPublishBatchResult(batch.name, batch.currentSemester); 
                      showToast("success", "Launch Successful", `Result for ${batch.name} successfully published live!`); 
                    }} 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Send size={14}/> Quick Launch
                  </button>
                )}

                {isPublished && (
                  <>
                    <button 
                      onClick={() => {
                        showConfirm("Unpublish Result?", `Are you sure you want to hide the result for ${batch.name}?`, () => {
                          adminUnpublishBatchResult(batch.name, batch.currentSemester);
                          showToast("info", "Unpublished", `Result for ${batch.name} has been hidden.`);
                        });
                      }} 
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 size={14}/> Unpublish
                    </button>
                    <button 
                      onClick={() => { setPromotingBatch(batch); setNewCoordinatorEmail(batch.coordinator); }} 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm animate-pulse"
                    >
                      <ArrowUpRight size={14}/> Promote to Sem {batch.currentSemester + 1}
                    </button>
                  </>
                )}

                {/* 🔥 NEW DANGER BUTTON: DELETE RESULT */}
                <button 
                  onClick={() => handleDeleteResult(batch.name, batch.currentSemester)} 
                  className="px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-sm transition-all group"
                  title="Wipe all marks for this semester"
                >
                  <Trash size={14} className="group-hover:animate-bounce"/> Delete Result
                </button>

                <button onClick={() => { setActiveBatch(batch.name); setEditSubject(""); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-sm"><Edit3 size={14}/> Manage Roster</button>
              </div>
            </div>
          );
        })}
        {batches.length === 0 && <div className="p-8 text-center text-muted border border-dashed border-border rounded-xl">No batches available in the system.</div>}
      </div>
    </div>
  );
};
export default ResultLaunch;