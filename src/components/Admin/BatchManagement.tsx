import React, { useState } from "react";
import { Users, Trash2, Edit } from "lucide-react";
import { useAcademic, Batch } from "../../context/AcademicContext";

const BatchManagement: React.FC = () => {
  const { departments, batches, addBatch, editBatch, deleteBatch, faculties, showToast, showConfirm } = useAcademic();
  const [batchName, setBatchName] = useState("");
  const [batchDept, setBatchDept] = useState(departments[0] || "");
  const [batchCoordinator, setBatchCoordinator] = useState("");
  const [academicSession, setAcademicSession] = useState("2026-29");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const sessionOptions = [
    `${currentYear}-${String(currentYear + 2).slice(2)}`,
    `${currentYear}-${String(currentYear + 3).slice(2)}`,
    `${currentYear}-${String(currentYear + 4).slice(2)}`
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName || !batchDept || !batchCoordinator || !academicSession) {
      showToast("warning", "Incomplete", "Please fill all batch details.");
      return;
    }
    
    const batchObj: Batch = { 
      name: batchName, 
      dept: batchDept, 
      coordinator: batchCoordinator,
      academicSession,
      currentSemester: 1
    };

    if (editingIndex !== null) {
      const existingSem = batches[editingIndex].currentSemester || 1;
      editBatch(editingIndex, { ...batchObj, currentSemester: existingSem });
      showToast("success", "Batch Updated", `${batchName} has been updated.`);
      setEditingIndex(null);
    } else {
      addBatch(batchObj);
      showToast("success", "Batch Initialized", `${batchName} (Sem 1) has been created.`);
    }
    setBatchName(""); setBatchCoordinator(""); setAcademicSession(sessionOptions[0]);
  };

  const handleEdit = (index: number) => {
    const b = batches[index];
    setBatchName(b.name);
    setBatchDept(b.dept);
    setBatchCoordinator(b.coordinator);
    setAcademicSession(b.academicSession || sessionOptions[0]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number, name: string) => {
    showConfirm("Delete Batch?", `Warning: Deleting ${name} will severely impact tied records. Are you sure?`, () => {
      deleteBatch(index);
      showToast("info", "Deleted", `${name} has been removed.`);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2 text-sm font-bold text-[#111827] pb-2 border-b border-border">
        <Users size={18} className="text-primary" /> <span>Batch Lifecycle Management</span>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-background p-5 rounded-xl border border-border space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Batch Nomenclature</label>
            <input type="text" placeholder="e.g. BCA-11" value={batchName} onChange={(e) => setBatchName(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary font-mono uppercase" required />
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Academic Session</label>
            <select value={academicSession} onChange={(e) => setAcademicSession(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none cursor-pointer focus:border-primary">
              {sessionOptions.map((sess, i) => <option key={i} value={sess}>{sess}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Department</label>
            <select value={batchDept} onChange={(e) => setBatchDept(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none cursor-pointer focus:border-primary">
              {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Batch Coordinator</label>
            <select value={batchCoordinator} onChange={(e) => setBatchCoordinator(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none cursor-pointer focus:border-primary" required>
              <option value="">-- Select Faculty --</option>
              {faculties.map((f, i) => <option key={i} value={f.email}>{f.firstName} {f.lastName} ({f.email})</option>)}
            </select>
          </div>
        </div>
        <div className="text-right">
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm cursor-pointer hover:bg-indigo-700 transition-colors">
            {editingIndex !== null ? "Update Batch" : "Initialize New Batch (Sem 1)"}
          </button>
        </div>
      </form>

      <div className="border border-border rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-800 text-white font-semibold">
            <tr>
              <th className="p-3">Batch Name</th>
              <th className="p-3">Session</th>
              <th className="p-3">Active Semester</th>
              <th className="p-3">Department</th>
              <th className="p-3">Coordinator</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {batches.map((b, i) => (
              <tr key={i} className="hover:bg-background/50">
                <td className="p-3 font-mono font-bold text-primary uppercase">{b.name}</td>
                <td className="p-3 font-bold text-slate-700">{b.academicSession || "N/A"}</td>
                <td className="p-3"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-bold">Sem {b.currentSemester || 1}</span></td>
                <td className="p-3 text-muted">{b.dept}</td>
                <td className="p-3 text-muted font-medium">{b.coordinator}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button onClick={() => handleEdit(i)} className="p-1.5 text-slate-500 hover:text-primary hover:bg-indigo-50 rounded cursor-pointer"><Edit size={14}/></button>
                  <button onClick={() => handleDelete(i, b.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted">No batches initialized yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BatchManagement;
