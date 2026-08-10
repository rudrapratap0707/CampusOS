import React from "react";
import { BookOpen, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Student, AttendanceRecord, useAcademic } from "../../context/AcademicContext";

interface Props {
  selectedBatch: string;
  selectedSubject: string;
  attendanceRecords: AttendanceRecord[];
  students: Student[];
}

const AttendanceLedger: React.FC<Props> = ({ selectedBatch, selectedSubject, attendanceRecords, students }) => {
  const { batches } = useAcademic();
  const currentSem = batches.find(b => b.name === selectedBatch)?.currentSemester || 1;

  // STRICT SEMESTER FILTERING
  const ledgerRecords = attendanceRecords.filter(r => 
    r.batch === selectedBatch && 
    (r.semester || 1) === currentSem && 
    r.subject === selectedSubject
  );

  const batchStudents = students.filter(s => s.batch === selectedBatch);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <BookOpen className="text-primary" size={24} />
        <div>
          <h3 className="text-base font-bold text-[#111827]">Attendance Ledger <span className="bg-slate-100 text-xs px-2 py-0.5 rounded text-slate-600 font-mono ml-2">Sem {currentSem}</span></h3>
          <p className="text-xs text-muted mt-0.5">Historical view of all recorded sessions for {selectedSubject}.</p>
        </div>
      </div>

      {ledgerRecords.length === 0 ? (
        <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-muted">
          No attendance records found for this semester.
        </div>
      ) : (
        <div className="space-y-4">
          {ledgerRecords.slice().reverse().map((record, idx) => (
            <div key={idx} className="bg-background rounded-xl border border-border overflow-hidden shadow-xs">
              <div className="bg-slate-800 text-white p-3 flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-indigo-400"/> {record.date}</div>
                <div className="font-medium text-slate-300">{record.topic}</div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {batchStudents.map(st => {
                  const status = record.records.find(r => r.rollNo === st.rollNo)?.status || "Absent";
                  return (
                    <div key={st.rollNo} className={`flex flex-col p-2 rounded-lg border ${status === "Present" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"} items-center justify-center text-center`}>
                      <span className="font-mono text-[10px] font-bold text-slate-600">{st.rollNo}</span>
                      <span className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${status === "Present" ? "text-emerald-700" : "text-red-700"}`}>
                        {status === "Present" ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AttendanceLedger;
