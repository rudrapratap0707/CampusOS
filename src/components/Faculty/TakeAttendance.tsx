import React, { useState } from "react";
import { Calendar, CheckSquare, XSquare, Save, AlertCircle, BookOpen } from "lucide-react";
import { Student, AttendanceRecord, useAcademic } from "../../context/AcademicContext";

interface Props {
  selectedBatch: string;
  selectedSubject: string;
  batchStudents: Student[];
  attendanceRecords: AttendanceRecord[];
  saveAttendance: (record: AttendanceRecord) => void;
}

// 🔥 FIX: Added default empty arrays (= []) to props to prevent "undefined" crashes
const TakeAttendance: React.FC<Props> = ({ 
  selectedBatch, 
  selectedSubject, 
  batchStudents = [], 
  attendanceRecords = [], 
  saveAttendance 
}) => {
  // 🔥 FIX: Fallback for batches as well
  const { batches = [], showToast } = useAcademic(); 
  const currentSem = batches.find(b => b.name === selectedBatch)?.currentSemester || 1;

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [topic, setTopic] = useState("");
  const [attendance, setAttendance] = useState<{ [rollNo: string]: "Present" | "Absent" }>({});

  const todayRecords = attendanceRecords.filter(r => 
    r.date === date && 
    r.batch === selectedBatch && 
    (r.semester || 1) === currentSem && 
    r.subject === selectedSubject
  );
  const slotCount = todayRecords.length;

  const markAll = (status: "Present" | "Absent") => {
    const newAtt: any = {};
    batchStudents.forEach(st => newAtt[st.rollNo] = status);
    setAttendance(newAtt);
  };

  const handleSave = () => {
    if (!topic) { 
      showToast("warning", "Missing Information", "Please enter the topic covered in this session."); 
      return; 
    }
    if (Object.keys(attendance).length !== batchStudents.length) { 
      showToast("error", "Incomplete Roll Call", "Please mark attendance for all students before committing."); 
      return; 
    }

    const records = batchStudents.map(st => ({ 
      rollNo: st.rollNo, 
      status: attendance[st.rollNo] || "Absent" as "Present"|"Absent" 
    }));
    
    saveAttendance({ date, batch: selectedBatch, semester: currentSem, subject: selectedSubject, topic, records });
    
    showToast("success", "Attendance Committed", `Attendance for Slot ${slotCount + 1} has been securely saved!`);
    
    setTopic("");
    setAttendance({});
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Live Attendance Roll Call <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
          <p className="text-xs text-muted mt-0.5">Record real-time attendance for your designated subjects.</p>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <Save size={16} /> Commit Attendance (Slot {slotCount + 1})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5"><Calendar size={14}/> Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary bg-white shadow-sm" />
        </div>
        <div className="bg-background p-4 rounded-xl border border-border flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5"><BookOpen size={14}/> Topic Description</label>
          <input type="text" placeholder="e.g. Memory Management, File Systems..." value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary bg-white shadow-sm" />
        </div>
      </div>

      {slotCount > 0 && (
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 p-3 rounded-lg animate-in zoom-in-95">
          <AlertCircle size={16} /> 
          Info: {slotCount} slot(s) already recorded for {date}. You are now marking attendance for Slot {slotCount + 1}.
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={() => markAll("Present")} className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex justify-center items-center gap-2"><CheckSquare size={16}/> Mark All Present</button>
        <button onClick={() => markAll("Absent")} className="flex-1 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex justify-center items-center gap-2"><XSquare size={16}/> Mark All Absent</button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden shadow-xs mt-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-800 text-white font-semibold">
            <tr><th className="p-3">Roll Number</th><th className="p-3">Student Name</th><th className="p-3 text-center w-48">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {batchStudents.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-muted">No students found.</td></tr>
            ) : (
              batchStudents.map((st) => (
                <tr key={st.rollNo} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-semibold">{st.rollNo}</td>
                  <td className="p-3 font-bold text-[#111827]">{st.firstName} {st.lastName}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => setAttendance({ ...attendance, [st.rollNo]: "Present" })} className={`px-4 py-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${attendance[st.rollNo] === "Present" ? "bg-emerald-600 text-white border-emerald-700 shadow-sm" : "bg-white text-slate-500 border-slate-300 hover:border-emerald-500 hover:text-emerald-600"}`}>Present</button>
                    <button onClick={() => setAttendance({ ...attendance, [st.rollNo]: "Absent" })} className={`px-4 py-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${attendance[st.rollNo] === "Absent" ? "bg-red-500 text-white border-red-600 shadow-sm" : "bg-white text-slate-500 border-slate-300 hover:border-red-500 hover:text-red-500"}`}>Absent</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TakeAttendance;
