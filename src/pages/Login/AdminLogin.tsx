import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Users, Layers, BookOpen, Settings, Award } from "lucide-react";
import { useAcademic } from "../../context/AcademicContext"; // IMPORT ACADEMIC CONTEXT

import DepartmentManagement from "../../components/Admin/DepartmentManagement";
import FacultyManagement from "../../components/Admin/FacultyManagement";
import BatchManagement from "../../components/Admin/BatchManagement";
import SubjectManagement from "../../components/Admin/SubjectManagement";
import PolicyConfiguration from "../../components/Admin/PolicyConfiguration";
import ResultLaunch from "../../components/Admin/ResultLaunch";

type AdminTab = "departments" | "faculties" | "batches" | "subjects" | "policies" | "results";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showConfirm, showToast } = useAcademic(); // PULL NOTIFICATION FUNCTIONS
  const [activeTab, setActiveTab] = useState<AdminTab>("departments");

  const handleLogout = () => {
    showConfirm("Sign Out", "Are you sure you want to sign out of the Admin Root?", () => {
      showToast("info", "Signed Out", "You have been signed out.");
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex text-[#111827]">
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-extrabold text-white tracking-tight">CampusOS</h1>
          </div>
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button onClick={() => setActiveTab("departments")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "departments" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <Shield size={16} /> Departments
            </button>
            <button onClick={() => setActiveTab("faculties")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "faculties" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <Users size={16} /> Faculty Data
            </button>
            <button onClick={() => setActiveTab("batches")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "batches" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <Layers size={16} /> Batches & Coords
            </button>
            <button onClick={() => setActiveTab("subjects")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "subjects" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <BookOpen size={16} /> Subject (CBCS)
            </button>
            <button onClick={() => setActiveTab("results")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "results" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <Award size={16} /> Result Launch Cell
            </button>
            <button onClick={() => setActiveTab("policies")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "policies" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}>
              <Settings size={16} /> Policy Engine
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800 text-[11px] text-slate-500">
          CampusOS v1.0 ROOT
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-border py-4 px-8 flex justify-between items-center shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block">ROOT WORKSPACE</span>
            <h2 className="text-xl font-bold text-[#111827]">System Governance Portal</h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-muted">Admin Root Access</span>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all cursor-pointer shadow-xs">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full">
          {activeTab === "departments" && <DepartmentManagement />}
          {activeTab === "faculties" && <FacultyManagement />}
          {activeTab === "batches" && <BatchManagement />}
          {activeTab === "subjects" && <SubjectManagement />}
          {activeTab === "results" && <ResultLaunch />}
          {activeTab === "policies" && <PolicyConfiguration />}
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;
