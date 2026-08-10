import React, { useState } from "react";
import { Student, Subject, AttendanceRecord, useAcademic } from "../../context/AcademicContext";

interface Props {
  currentStudent: Student;
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  condonationLimit: string;
}

const AttendanceMatrix: React.FC<Props> = ({ currentStudent, subjects, attendanceRecords }) => {
  const { batches } = useAcademic();
  const currentSem = batches.find(b => b.name === currentStudent.batch)?.currentSemester || 1;

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.code || "");
  const [activeSubject, setActiveSubject] = useState(subjects[0]?.code || "");

  const handleSubmit = () => {
    setActiveSubject(selectedSubject);
  };

  // Filter records for active subject & current semester
  const subjectRecords = attendanceRecords.filter(r => 
    r.batch === currentStudent.batch && 
    (r.semester || 1) === currentSem && 
    r.subject.includes(activeSubject)
  );

  // Group by Date
  const grouped: { [date: string]: string[] } = {};
  subjectRecords.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = [];
    const stRec = r.records.find(sr => sr.rollNo === currentStudent.rollNo);
    grouped[r.date].push(stRec ? (stRec.status === "Present" ? "P" : "A") : "-");
  });

  // Sort dates descending (Newest first)
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const slotTotals: any = { 1: { p:0, t:0 }, 2: { p:0, t:0 }, 3: { p:0, t:0 }, 4: { p:0, t:0 }, 5: { p:0, t:0 }, 6: { p:0, t:0 } };
  let grandP = 0;
  let grandTotal = 0;

  const rows = sortedDates.map((date, index) => {
    const slots = grouped[date];
    let dayP = 0;
    let dayTotal = 0;

    const slotCols = [1, 2, 3, 4, 5, 6].map(slotNum => {
      const val = slots[slotNum - 1] || "-";
      if (val === "P") { dayP++; slotTotals[slotNum].p++; slotTotals[slotNum].t++; }
      if (val === "A") { slotTotals[slotNum].t++; }
      if (val !== "-") { dayTotal++; }
      return val;
    });

    grandP += dayP;
    grandTotal += dayTotal;
    const dayPct = dayTotal === 0 ? 0 : Math.round((dayP / dayTotal) * 100);

    const [y, m, d] = date.split('-');
    return { sno: index + 1, date: `${d}/${m}/${y}`, slots: slotCols, p: dayP, total: dayTotal, pct: dayPct };
  });

  const overallPct = grandTotal === 0 ? 0 : Math.round((grandP / grandTotal) * 100);

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-200 animate-in fade-in duration-300">
      
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700">My Attendance</h2>
      </div>

      <div className="p-6">
        <div className="max-w-xl space-y-4 mb-8">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded text-sm text-slate-700 outline-none focus:border-slate-400 uppercase"
            >
              {subjects.map(sub => (
                <option key={sub.code} value={sub.code}>{sub.title} ({sub.code})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 bg-[#3cb88d] hover:bg-[#32a07a] text-white text-sm font-medium rounded shadow-sm transition-colors cursor-pointer"
          >
            Submit
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#796eb2] text-white">
              <tr>
                <th className="p-3 font-semibold border-r border-[#8f85c1] w-16">S.No.</th>
                <th className="p-3 font-semibold border-r border-[#8f85c1]">Date</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">1</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">2</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">3</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">4</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">5</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">6</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-12">P</th>
                <th className="p-3 text-center font-semibold border-r border-[#8f85c1] w-16">P+A</th>
                <th className="p-3 text-right font-semibold w-16">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map(row => (
                <tr key={row.sno} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 border-r border-slate-200 text-slate-600">{row.sno}</td>
                  <td className="p-3 border-r border-slate-200 text-slate-600">{row.date}</td>
                  {row.slots.map((val, i) => (
                    <td key={i} className="p-3 text-center border-r border-slate-200 font-medium text-slate-700">{val}</td>
                  ))}
                  <td className="p-3 text-center border-r border-slate-200 text-slate-700">{row.p}</td>
                  <td className="p-3 text-center border-r border-slate-200 text-slate-700">{row.total}</td>
                  <td className="p-3 text-right font-bold text-slate-800">{row.pct}</td>
                </tr>
              ))}
              
              {/* Table Footer matching Screenshot */}
              <tr className="bg-slate-50 font-bold text-slate-800">
                <td colSpan={2} className="p-3 border-r border-slate-200 text-right">Total:</td>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <td key={num} className="p-3 text-center border-r border-slate-200">
                    {slotTotals[num].t > 0 ? `${slotTotals[num].p}/${slotTotals[num].t}` : "-"}
                  </td>
                ))}
                <td className="p-3 text-center border-r border-slate-200">{grandP}</td>
                <td className="p-3 text-center border-r border-slate-200">{grandTotal}</td>
                <td className="p-3 text-right">{overallPct}</td>
              </tr>
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-slate-50 border-t border-slate-200">
              No attendance data available for the selected subject.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceMatrix;
