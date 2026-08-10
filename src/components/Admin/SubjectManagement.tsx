import React, { useState } from "react";
import { BookOpen, Edit3, Trash2 } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext";

const SubjectManagement: React.FC = () => {
  const { departments, subjects, addSubject, editSubject, deleteSubject, showToast, showConfirm } = useAcademic();
  
  const [subCode, setSubCode] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subDept, setSubDept] = useState(departments[0] || "");
  const [subCredits, setSubCredits] = useState<number>(4);
  const [editingSubCode, setEditingSubCode] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCode || !subTitle || !subDept) { 
      showToast("warning", "Missing Fields", "Please fill all subject details."); 
      return; 
    }
    if (editingSubCode) {
      editSubject(editingSubCode, { code: subCode, title: subTitle, dept: subDept, hours: "4 L + 0 T + 2 P", credits: subCredits });
      showToast("success", "Subject Updated", `${subCode} updated successfully.`);
      setEditingSubCode(null);
    } else {
      addSubject({ code: subCode, title: subTitle, dept: subDept, hours: "4 L + 0 T + 2 P", credits: subCredits });
      showToast("success", "Subject Registered", `${subTitle} (${subCode}) has been added.`);
    }
    setSubCode(""); setSubTitle(""); setSubCredits(4);
  };

  const handleDelete = (code: string) => {
    showConfirm("Remove Subject?", `Are you sure you want to delete ${code}?`, () => {
      deleteSubject(code);
      showToast("info", "Deleted", `Subject ${code} removed.`);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4 animate-in fade-in">
      <div className="flex items-center gap-2 text-sm font-bold text-[#111827] pb-2 border-b border-border">
        <BookOpen size={18} className="text-primary" />
        <span>Subject Registration (CBCS) & Credits</span>
      </div>
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <select value={subDept} onChange={(e) => setSubDept(e.target.value)} className="p-2.5 rounded-lg border border-border bg-background text-xs outline-none cursor-pointer">
          {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
        <input type="text" placeholder="Subject Code" value={subCode} onChange={(e) => setSubCode(e.target.value)} className="p-2.5 rounded-lg border border-border bg-background text-xs outline-none font-mono" />
        <input type="text" placeholder="Subject Title" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="p-2.5 rounded-lg border border-border bg-background text-xs outline-none" />
        <select value={subCredits} onChange={(e) => setSubCredits(Number(e.target.value))} className="p-2.5 rounded-lg border border-border bg-background text-xs outline-none cursor-pointer">
          {[1,2,3,4,5,6].map(c => <option key={c} value={c}>{c} Credits</option>)}
        </select>
        <button type="submit" className="py-2.5 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer">
          {editingSubCode ? "Update Subject" : "Register Subject"}
        </button>
      </form>
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-background border-b border-border text-muted font-semibold">
            <tr><th className="p-3">Code</th><th className="p-3">Title</th><th className="p-3">Department</th><th className="p-3 text-center">Credits</th><th className="p-3 text-center">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subjects.map((sub) => (
              <tr key={sub.code} className="hover:bg-background/50">
                <td className="p-3 font-mono font-bold text-primary">{sub.code}</td><td className="p-3 font-bold">{sub.title}</td><td className="p-3 text-muted">{sub.dept}</td>
                <td className="p-3 text-center font-bold">{sub.credits || 4}</td>
                <td className="p-3 text-center flex items-center justify-center gap-2">
                  <button onClick={() => { setSubCode(sub.code); setSubTitle(sub.title); setSubDept(sub.dept); setSubCredits(sub.credits || 4); setEditingSubCode(sub.code); }} className="p-1.5 text-primary cursor-pointer"><Edit3 size={14}/></button>
                  <button onClick={() => handleDelete(sub.code)} className="p-1.5 text-red-500 cursor-pointer"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SubjectManagement;
