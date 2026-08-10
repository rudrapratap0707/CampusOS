import React, { useState } from "react";
import { Trash2, UserPlus, FileEdit, Check, X, ShieldAlert, KeyRound } from "lucide-react";
import { Student, useAcademic } from "../../context/AcademicContext";

interface Props {
  selectedBatch: string;
  batchStudents: Student[];
  addStudent: (st: Student) => void;
  deleteStudent: (rollNo: string) => void;
}

const BatchEnrollment: React.FC<Props> = ({ selectedBatch, batchStudents, addStudent, deleteStudent }) => {
  const { profileRequests, approveProfileUpdate, rejectProfileUpdate, passwordRequests, approvePasswordReset, rejectPasswordReset } = useAcademic();
  
  const [stRoll, setStRoll] = useState(""); const [stFirst, setStFirst] = useState(""); const [stLast, setStLast] = useState("");
  const [stEmail, setStEmail] = useState(""); const [stPhone, setStPhone] = useState(""); const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState(""); const [enrollmentNo, setEnrollmentNo] = useState(""); const [address, setAddress] = useState("");

  const pendingProfileReqs = profileRequests.filter(r => r.batch === selectedBatch);
  const pendingPassReqs = passwordRequests.filter(r => r.userType === "student" && r.batch === selectedBatch && r.status === "Pending");

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({ rollNo: stRoll, firstName: stFirst, lastName: stLast, email: stEmail, phone: stPhone, batch: selectedBatch, fatherName, motherName, enrollmentNo, address });
    setStRoll(""); setStFirst(""); setStLast(""); setStEmail(""); setStPhone(""); setFatherName(""); setMotherName(""); setEnrollmentNo(""); setAddress("");
    alert("Student Enrolled! Default Password configured: Student@2026");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Password Reset Approvals - ALWAYS VISIBLE */}
      <div className={`rounded-2xl border p-6 shadow-xs space-y-4 ${pendingPassReqs.length > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
        <div className={`flex items-center justify-between pb-3 border-b ${pendingPassReqs.length > 0 ? "border-red-200" : "border-slate-200"}`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className={pendingPassReqs.length > 0 ? "text-red-600" : "text-slate-400"} size={18}/>
            <h3 className={`text-sm font-bold ${pendingPassReqs.length > 0 ? "text-red-900" : "text-slate-600"}`}>Student Password Reset Requests</h3>
          </div>
          <span className={`${pendingPassReqs.length > 0 ? "bg-red-600 text-white animate-pulse" : "bg-slate-200 text-slate-500"} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            {pendingPassReqs.length} Pending
          </span>
        </div>
        
        {pendingPassReqs.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4 flex flex-col items-center gap-2">
            <KeyRound size={24} className="text-slate-300"/>
            <p>All student accounts are secure. No reset requests pending for {selectedBatch}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPassReqs.map(req => {
              const student = batchStudents.find(s => s.rollNo === req.identifier);
              return (
                <div key={req.id} className="p-4 bg-white rounded-xl border border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="text-xs">
                    <p className="font-bold text-[#111827]">{student?.firstName} {student?.lastName} <span className="text-primary font-mono ml-2">({req.identifier})</span></p>
                    <p className="text-[10px] text-muted mt-1">Requested New Hash: <span className="font-mono bg-slate-100 p-1 rounded">{req.newPasswordHash.substring(0,25)}...</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approvePasswordReset(req.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"><Check size={14}/> Approve Override</button>
                    <button onClick={() => rejectPasswordReset(req.id)} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"><X size={14}/> Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Profile Updates (Phone/Address) */}
      {pendingProfileReqs.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
            <FileEdit className="text-amber-600" size={18}/>
            <h3 className="text-sm font-bold text-amber-900">Pending Student Profile Updates</h3>
          </div>
          <div className="space-y-3">
            {pendingProfileReqs.map(req => {
              const student = batchStudents.find(s => s.rollNo === req.rollNo);
              return (
                <div key={req.id} className="p-4 bg-white rounded-xl border border-amber-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div className="text-xs">
                    <p className="font-bold text-[#111827]">{student?.firstName} {student?.lastName} <span className="text-primary font-mono ml-2">({req.rollNo})</span></p>
                    <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <div><span className="text-muted block text-[10px]">Requested Phone</span><span className="font-bold text-slate-800">{req.requestedPhone}</span></div>
                      <div><span className="text-muted block text-[10px]">Requested Address</span><span className="font-bold text-slate-800">{req.requestedAddress}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveProfileUpdate(req.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-700 cursor-pointer shadow-sm"><Check size={14}/> Approve</button>
                    <button onClick={() => rejectProfileUpdate(req.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-red-200 cursor-pointer shadow-sm"><X size={14}/> Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Enrollment Form (RESTORED FULL FIELDS) */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Student Enrollment Roster ({selectedBatch})</h3>
            <p className="text-xs text-muted mt-0.5">Register students with complete academic and family details.</p>
          </div>
          <UserPlus className="text-primary" size={20}/>
        </div>

        <form onSubmit={handleEnroll} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-background p-4 rounded-xl border border-border">
          <input required type="text" placeholder="Roll No" value={stRoll} onChange={e => setStRoll(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none font-mono" />
          <input required type="text" placeholder="Enrollment No" value={enrollmentNo} onChange={e => setEnrollmentNo(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="text" placeholder="First Name" value={stFirst} onChange={e => setStFirst(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="text" placeholder="Last Name" value={stLast} onChange={e => setStLast(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="text" placeholder="Father's Name" value={fatherName} onChange={e => setFatherName(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="text" placeholder="Mother's Name" value={motherName} onChange={e => setMotherName(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <input required type="email" placeholder="Email" value={stEmail} onChange={e => setStEmail(e.target.value)} className="p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
          <div className="flex gap-2 sm:col-span-4">
            <input required type="text" placeholder="Phone" value={stPhone} onChange={e => setStPhone(e.target.value)} className="w-1/4 p-2.5 rounded-lg border border-border bg-surface text-xs outline-none" />
            <div className="flex-1 text-right">
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer">Enroll Student & Generate Default Hash</button>
            </div>
          </div>
        </form>

        <div className="border border-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-background border-b border-border text-muted font-semibold">
              <tr>
                <th className="p-3">Roll No / Enroll</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Parents Details</th>
                <th className="p-3">Contact Info</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batchStudents.map(st => (
                <tr key={st.rollNo} className="hover:bg-background/50">
                  <td className="p-3">
                    <span className="font-mono font-bold text-primary block">{st.rollNo}</span>
                    <span className="text-[10px] text-muted">Enr: {st.enrollmentNo || "N/A"}</span>
                  </td>
                  <td className="p-3 font-bold text-[#111827]">{st.firstName} {st.lastName}</td>
                  <td className="p-3 text-muted">
                    <span className="block">F: {st.fatherName || "N/A"}</span>
                    <span className="block">M: {st.motherName || "N/A"}</span>
                  </td>
                  <td className="p-3">
                    <span className="block text-primary">{st.email}</span>
                    <span className="block text-muted">{st.phone}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">{st.address}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteStudent(st.rollNo)} className="text-red-500 hover:bg-red-50 p-2 rounded cursor-pointer transition-all"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BatchEnrollment;
