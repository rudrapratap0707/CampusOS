import React, { useState } from "react";
import { Users, Plus, Edit3, Trash2 } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

const DepartmentManagement: React.FC = () => {
  const { departments, addDept, editDept, deleteDept, showToast, showConfirm } = useAcademic();
  const [newDept, setNewDept] = useState("");
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [deptEditText, setDeptEditText] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim()) { 
      showToast("warning", "Input Required", "Enter a department name."); 
      return; 
    }
    addDept(newDept.trim());
    showToast("success", "Department Added", `${newDept.trim()} added successfully!`);
    setNewDept("");
  };

  const handleDelete = (deptName: string) => {
    showConfirm("Delete Department?", `Are you sure you want to delete '${deptName}'?`, () => {
      deleteDept(deptName);
      showToast("info", "Deleted", `${deptName} has been removed.`);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4 animate-in fade-in">
      <div className="flex items-center gap-2 text-sm font-bold text-[#111827] pb-2 border-b border-border">
        <Users size={18} className="text-primary" />
        <span>Department Management</span>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input type="text" placeholder="New Department Name..." value={newDept} onChange={(e) => setNewDept(e.target.value)} className="flex-1 p-2.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary font-medium" />
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer"><Plus size={14} /> Add Department</button>
      </form>
      <div className="space-y-2">
        {departments.map((d, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-background border border-border text-xs font-medium">
            {editingDept === d ? (
              <input type="text" value={deptEditText} onChange={(e) => setDeptEditText(e.target.value)} className="p-1.5 border border-primary rounded bg-surface text-xs outline-none w-1/2" />
            ) : <span>{d}</span>}
            <div className="flex items-center gap-2">
              {editingDept === d ? (
                <button onClick={() => { editDept(d, deptEditText); setEditingDept(null); showToast("success", "Saved", "Department name updated."); }} className="px-3 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold cursor-pointer">Save</button>
              ) : (
                <button onClick={() => { setEditingDept(d); setDeptEditText(d); }} className="p-1.5 text-primary hover:bg-primary/10 rounded cursor-pointer"><Edit3 size={14} /></button>
              )}
              <button onClick={() => handleDelete(d)} className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DepartmentManagement;
