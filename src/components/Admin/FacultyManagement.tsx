import React, { useState } from "react";
import { Users, Trash2, Fingerprint, ShieldCheck, Check, X } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

const FacultyManagement: React.FC = () => {
  const { departments, faculties, addFaculty, deleteFaculty, passwordRequests, approvePasswordReset, rejectPasswordReset, showToast, showConfirm } = useAcademic();
  
  const [facFirst, setFacFirst] = useState(""); const [facLast, setFacLast] = useState(""); const [facEmail, setFacEmail] = useState(""); const [facDept, setFacDept] = useState(departments[0] || "");
  const currentYear = new Date().getFullYear(); const idPrefix = `EMP-${currentYear}-`;
  let maxSeq = 0; faculties.forEach(f => { if (f.id && f.id.startsWith(idPrefix)) { const seqParts = f.id.split('-'); if (seqParts.length === 3) { const seqNum = parseInt(seqParts[2], 10); if (!isNaN(seqNum) && seqNum > maxSeq) { maxSeq = seqNum; } } } });
  const nextSeq = maxSeq + 1; const nextExpectedId = `${idPrefix}${String(nextSeq).padStart(4, '0')}`;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facFirst || !facLast || !facEmail || !facDept) {
      showToast("warning", "Missing Fields", "Please complete all fields.");
      return;
    }
    addFaculty({ id: nextExpectedId, firstName: facFirst, lastName: facLast, email: facEmail, dept: facDept });
    setFacFirst(""); setFacLast(""); setFacEmail("");
    showToast("success", "Faculty Registered", "Successfully registered with default password: Campus@2026");
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm("Delete Faculty?", `Are you sure you want to remove ${name} (${id})?`, () => {
      deleteFaculty(id);
      showToast("info", "Faculty Removed", `${name} has been removed from the system.`);
    });
  };

  const pendingFacRequests = passwordRequests.filter(r => r.userType === "faculty" && r.status === "Pending");

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-6 animate-in fade-in">
      
      {pendingFacRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
            <ShieldCheck size={18} className="text-amber-600"/>
            <h3 className="font-bold text-amber-900 text-sm">Pending Faculty Password Resets ({pendingFacRequests.length})</h3>
          </div>
          <div className="space-y-3">
            {pendingFacRequests.map(req => {
              const fac = faculties.find(f => f.email === req.identifier);
              return (
                <div key={req.id} className="p-4 bg-white rounded-lg border border-amber-100 flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-slate-800">{fac?.firstName} {fac?.lastName} <span className="text-primary text-xs ml-2">({req.identifier})</span></span>
                    <span className="block text-[10px] text-muted font-mono mt-1">Requested Hash: {req.newPasswordHash.substring(0,20)}...</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { approvePasswordReset(req.id); showToast("success", "Approved", "Password reset approved."); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"><Check size={14}/> Approve</button>
                    <button onClick={() => { rejectPasswordReset(req.id); showToast("info", "Rejected", "Password request declined."); }} className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-xs font-bold flex items-center gap-1"><X size={14}/> Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm font-bold text-[#111827] pb-2 border-b border-border">
        <Users size={18} className="text-primary" /> <span>Faculty Directory & Registration</span>
      </div>
      
      <form onSubmit={handleAdd} className="bg-background p-5 rounded-xl border border-border space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col justify-end">
             <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1"><Fingerprint size={12}/> Auto-Generated ID</label>
             <div className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 font-mono text-xs font-bold w-full cursor-not-allowed shadow-inner select-none flex items-center gap-2">{nextExpectedId}</div>
          </div>
          <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">First Name</label><input type="text" value={facFirst} onChange={(e) => setFacFirst(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" required /></div>
          <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Last Name</label><input type="text" value={facLast} onChange={(e) => setFacLast(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" required /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <div className="md:col-span-1"><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Institutional Email</label><input type="email" value={facEmail} onChange={(e) => setFacEmail(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" required /></div>
          <div className="md:col-span-1"><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Department</label><select value={facDept} onChange={(e) => setFacDept(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none cursor-pointer focus:border-primary">{departments.map((d, i) => <option key={i} value={d}>{d}</option>)}</select></div>
          <div className="md:col-span-1 text-right"><button type="submit" className="w-full px-6 py-2.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm cursor-pointer">Register New Faculty</button></div>
        </div>
      </form>

      <div className="border border-border rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-800 text-white font-semibold"><tr><th className="p-3">Faculty ID</th><th className="p-3">Full Name</th><th className="p-3">Email Address</th><th className="p-3">Department</th><th className="p-3 text-center">Action</th></tr></thead>
          <tbody className="divide-y divide-border bg-surface">
            {faculties.map((f) => (
              <tr key={f.id} className="hover:bg-background/50">
                <td className="p-3 font-mono font-bold text-primary">{f.id}</td><td className="p-3 font-bold text-[#111827] uppercase">{f.firstName} {f.lastName}</td><td className="p-3 text-muted">{f.email}</td><td className="p-3 text-muted">{f.dept}</td>
                <td className="p-3 text-center"><button onClick={() => handleDelete(f.id, f.firstName)} className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default FacultyManagement;
