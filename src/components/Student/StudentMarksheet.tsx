import React, { useState } from "react";
import { FileText, Printer } from "lucide-react";
import { Student, StudentMarkRecord, Subject, Batch } from "../../context/AcademicContext";

interface Props {
  currentStudent: Student;
  studentMarksDb: StudentMarkRecord[];
  subjects: Subject[];
  batches: Batch[];
  publishedBatches: { [key: string]: boolean };
}

export const StudentMarksheet: React.FC<Props> = ({ currentStudent, studentMarksDb, subjects, batches, publishedBatches }) => {
  const studentRecord = studentMarksDb.find(m => m.rollNo === currentStudent.rollNo);
  const history = studentRecord?.history || [];
  const currentBatchObj = batches.find(b => b.name === currentStudent.batch);
  const session = currentBatchObj?.academicSession || "2026-27";

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

  if (publishedHistory.length === 0) {
    return (
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-xs text-center flex flex-col items-center justify-center animate-in fade-in mt-6 print:hidden">
        <FileText size={48} className="text-slate-300 mb-4"/>
        <h3 className="text-lg font-bold text-[#111827]">No Marksheets Available</h3>
        <p className="text-sm text-muted mt-2">Your results have not been published by the administration yet.</p>
      </div>
    );
  }

  const currentSemData = publishedHistory.find(h => h.semester === selectedSem);
  const activeBacklogs = currentSemData?.backlogs || [];
  const passStatus = activeBacklogs.length === 0 ? "PASS" : "PCP (Promoted to Carry Paper)";

  // Calculations for Footer Totals matching the screenshot format
  let totalObtEse = 0; let totalMaxEse = 0;
  let totalObtCia = 0; let totalMaxCia = 0;
  let totalObtOverall = 0; let totalMaxOverall = 0;
  let totalCredits = 0;

  const rowData = Object.keys(currentSemData?.marks || {}).map(code => {
    const sub = subjects.find(s => s.code === code);
    const mark = currentSemData!.marks[code];
    const eseObt = mark.ese;
    const eseMax = 60;
    const ciaObt = mark.internalTest + mark.assignment + 10; // includes 10 auto att mark
    const ciaMax = 40;
    const overallObt = eseObt + ciaObt;
    const overallMax = 100;
    const credit = sub?.credits || 4;

    totalObtEse += eseObt; totalMaxEse += eseMax;
    totalObtCia += ciaObt; totalMaxCia += ciaMax;
    totalObtOverall += overallObt; totalMaxOverall += overallMax;
    totalCredits += credit;

    let grade = "C";
    if (overallObt >= 90) grade = "O";
    else if (overallObt >= 80) grade = "A+";
    else if (overallObt >= 70) grade = "A";
    else if (overallObt >= 60) grade = "B+";
    else if (overallObt >= 50) grade = "B";
    else if (overallObt >= 40) grade = "C";
    else grade = "F";

    return { code, title: sub?.title || code, eseObt, eseMax, ciaObt, ciaMax, overallObt, overallMax, credit, grade };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar (Hidden during print) */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="text-primary" size={24}/>
          <div>
            <h2 className="text-base font-bold text-[#111827]">Official Statement of Marks</h2>
            <p className="text-xs text-muted">Download or print your semester-wise official marksheet.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedSem} 
            onChange={e => setSelectedSem(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-primary outline-none cursor-pointer shadow-sm"
          >
            {publishedHistory.map(h => (
              <option key={h.semester} value={h.semester}>Semester {h.semester}</option>
            ))}
          </select>
          <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors">
            <Printer size={14}/> Print / Save PDF
          </button>
        </div>
      </div>

      {/* PRINTABLE MARKSHEET CONTAINER (Exact match to screenshot layout) */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto font-sans text-slate-900">
        
        {/* Header Section */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
          <h1 className="text-xl font-extrabold tracking-wide uppercase">School of Computer Applications</h1>
          <h2 className="text-sm font-bold text-slate-700 uppercase">Bachelor of Computer Applications</h2>
          <p className="text-xs font-semibold text-slate-600 pt-1">Session: {session} | Term: Semester {selectedSem}</p>
        </div>

        {/* Student Meta Details Grid */}
        <div className="py-4 grid grid-cols-2 gap-y-2 text-xs border-b border-slate-300">
          <div><span className="font-bold text-slate-600">Name:</span> <span className="font-extrabold uppercase">{currentStudent.firstName} {currentStudent.lastName}</span></div>
          <div><span className="font-bold text-slate-600">Roll No:</span> <span className="font-mono font-bold">{currentStudent.rollNo}</span></div>
          <div><span className="font-bold text-slate-600">Father Name:</span> <span className="font-semibold uppercase">{currentStudent.fatherName || "N/A"}</span></div>
          <div><span className="font-bold text-slate-600">Enrollment No:</span> <span className="font-mono">{currentStudent.enrollmentNo || currentStudent.rollNo}</span></div>
          <div><span className="font-bold text-slate-600">Mother Name:</span> <span className="font-semibold uppercase">{currentStudent.motherName || "N/A"}</span></div>
          <div><span className="font-bold text-slate-600">Status:</span> <span className="font-bold text-indigo-700">{passStatus}</span></div>
        </div>

        {/* Marks Table */}
        <div className="py-4">
          <table className="w-full border-collapse border border-slate-800 text-xs text-center">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-800">
                <th className="border-r border-slate-800 p-2 text-left">Subject Code</th>
                <th className="border-r border-slate-800 p-2" colSpan={2}>ESE Marks</th>
                <th className="border-r border-slate-800 p-2" colSpan={2}>CIA Marks</th>
                <th className="border-r border-slate-800 p-2" colSpan={2}>Total</th>
                <th className="border-r border-slate-800 p-2">Credit</th>
                <th className="p-2">Grade</th>
              </tr>
              <tr className="bg-slate-50 text-[11px] font-semibold border-b border-slate-800">
                <th className="border-r border-slate-800 p-1"></th>
                <th className="border-r border-slate-800 p-1">Obt.</th>
                <th className="border-r border-slate-800 p-1">Max.</th>
                <th className="border-r border-slate-800 p-1">Obt.</th>
                <th className="border-r border-slate-800 p-1">Max.</th>
                <th className="border-r border-slate-800 p-1">Obt.</th>
                <th className="border-r border-slate-800 p-1">Max.</th>
                <th className="border-r border-slate-800 p-1"></th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {rowData.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50">
                  <td className="border-r border-slate-800 p-2 font-mono font-bold text-left">{row.code}</td>
                  <td className="border-r border-slate-800 p-2 font-mono">{row.eseObt}</td>
                  <td className="border-r border-slate-800 p-2 font-mono text-slate-500">{row.eseMax}</td>
                  <td className="border-r border-slate-800 p-2 font-mono">{row.ciaObt}</td>
                  <td className="border-r border-slate-800 p-2 font-mono text-slate-500">{row.ciaMax}</td>
                  <td className="border-r border-slate-800 p-2 font-mono font-bold">{row.overallObt}</td>
                  <td className="border-r border-slate-800 p-2 font-mono text-slate-500">{row.overallMax}</td>
                  <td className="border-r border-slate-800 p-2 font-mono">{row.credit}</td>
                  <td className="p-2 font-bold">{row.grade}</td>
                </tr>
              ))}
              {/* Total Summary Row */}
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
                <td className="border-r border-slate-800 p-2 text-left">Total</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalObtEse}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalMaxEse}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalObtCia}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalMaxCia}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalObtOverall}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalMaxOverall}</td>
                <td className="border-r border-slate-800 p-2" colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Credit & SGPA Summary Table */}
        <div className="pb-6">
          <table className="w-full border-collapse border border-slate-800 text-xs text-center">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-800">
                <th className="border-r border-slate-800 p-2" colSpan={2}>Credit Theory</th>
                <th className="border-r border-slate-800 p-2" colSpan={2}>Credit Practical</th>
                <th className="p-2">SGPA</th>
              </tr>
              <tr className="bg-slate-50 text-[11px] font-semibold border-b border-slate-800">
                <th className="border-r border-slate-800 p-1">Obt.</th>
                <th className="border-r border-slate-800 p-1">Max.</th>
                <th className="border-r border-slate-800 p-1">Obt.</th>
                <th className="border-r border-slate-800 p-1">Max.</th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-slate-800 p-2 font-mono">{totalCredits}</td>
                <td className="border-r border-slate-800 p-2 font-mono">{totalCredits}</td>
                <td className="border-r border-slate-800 p-2 font-mono">5</td>
                <td className="border-r border-slate-800 p-2 font-mono">5</td>
                <td className="p-2 font-extrabold text-indigo-700 text-sm">{currentSemData?.sgpa?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Backlog details & Declaration */}
        <div className="text-xs space-y-2 pt-2 border-t border-slate-300">
          <p><span className="font-bold">Carry Over Paper(s):</span> {activeBacklogs.length > 0 ? activeBacklogs.join(", ") : "None"}</p>
          <div className="flex justify-between items-center pt-4">
            <span className="text-[11px] text-slate-500">Date of Declaration of Result: {new Date().toLocaleDateString()}</span>
            <div className="text-center">
              <div className="h-8 border-b border-slate-400 w-36 mb-1"></div>
              <span className="font-bold text-[10px]">Controller of Examinations</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default StudentMarksheet;
