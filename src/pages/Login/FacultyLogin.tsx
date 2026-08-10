import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, LogOut, CheckCircle2, Users, Calendar, BookOpen, Mail, Edit3, Calculator, ShieldAlert, BookPlus, Network, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAcademic, Faculty } from "../../context/AcademicContext";

import CieMatrix from "../../components/Faculty/CieMatrix";
import TakeAttendance from "../../components/Faculty/TakeAttendance";
import SgpaControl from "../../components/Faculty/SgpaControl";
import BatchEnrollment from "../../components/Faculty/BatchEnrollment";
import BatchSubjectSelection from "../../components/Faculty/BatchSubjectSelection";
import BatchFacultyAssignment from "../../components/Faculty/BatchFacultyAssignment";
import AttendanceLedger from "../../components/Faculty/AttendanceLedger";

export const FacultyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    faculties, batches, subjects, students, deleteStudent, addStudent, 
    attendanceRecords, saveAttendance, studentMarksDb, saveSubjectInternalAndEse, 
    submittedSubjects, submitSubjectToCoordinator,
    coordinatorApprovals, forwardBatchToAdmin, batchSubjectAssignments,
    requestPasswordReset, changePasswordDirectly, simulateHash,
    showToast // IMPORTED NOTIFICATION ENGINE
  } = useAcademic();

  const [loginMode, setLoginMode] = useState<"login" | "forgot">("login");
  const [isVerified, setIsVerified] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);

  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");
  const [forcedNewPass, setForcedNewPass] = useState("");

  const [isWorkspaceSet, setIsWorkspaceSet] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"matrix" | "attendance" | "ledger" | "enrollment" | "subjects" | "assignment" | "sgpa" | "security">("matrix");

  useEffect(() => {
    if (isWorkspaceSet && selectedBatch) {
      const stillExists = batches.some(b => b.name === selectedBatch);
      if (!stillExists) {
        showToast("warning", "Workspace Reset", "Your active batch has been promoted and renamed by the Admin. Please configure your workspace again.");
        setIsWorkspaceSet(false);
        setSelectedBatch("");
        setSelectedSubject("");
      }
    }
  }, [batches, isWorkspaceSet, selectedBatch, showToast]);

  useEffect(() => {
    if (!selectedBatch && batches.length > 0) {
      setSelectedBatch(batches[0].name);
    }
  }, [batches, selectedBatch]);

  const batchObj = batches.find(b => b.name === selectedBatch);
  const currentSem = batchObj?.currentSemester || 1;
  const isCoordinator = batchObj ? batchObj.coordinator.toLowerCase() === currentFaculty?.email?.toLowerCase() : false;
  const batchStudents = students.filter(s => s.batch === selectedBatch);

  const assignmentsForBatch = batchSubjectAssignments[`${selectedBatch}_${currentSem}`] || {};
  const assignedSubjects = subjects.filter(sub => assignmentsForBatch[sub.code] === currentFaculty?.email);
  
  let availableSubjectOptions = assignedSubjects.map(s => `${s.code}: ${s.title}`);
  if (isCoordinator) availableSubjectOptions.push("Coordinator Mode (Admin Only)");

  useEffect(() => {
    if (availableSubjectOptions.length > 0 && !availableSubjectOptions.includes(selectedSubject)) {
      setSelectedSubject(availableSubjectOptions[0]);
    } else if (availableSubjectOptions.length === 0) {
      setSelectedSubject("");
    }
  }, [selectedBatch, currentSem, availableSubjectOptions.length, currentFaculty, selectedSubject]);

  const isCoordinatorMode = selectedSubject === "Coordinator Mode (Admin Only)";

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const found = faculties.find(f => f.email.toLowerCase() === inputEmail.toLowerCase());
    if (found) {
      if (found.passwordHash === simulateHash(inputPassword) || !found.passwordHash) {
        setCurrentFaculty(found);
        setIsVerified(true);
      } else { 
        showToast("error", "Login Failed", "Invalid credentials! Incorrect password."); 
      }
    } else { 
      showToast("error", "Not Found", "Faculty email not found in database!"); 
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const checkFac = faculties.find(f => f.email.toLowerCase() === resetEmail.toLowerCase());
    if (!checkFac) { 
      showToast("error", "Not Found", "Faculty email not found."); 
      return; 
    }
    requestPasswordReset("faculty", checkFac.email, simulateHash(resetNewPass));
    showToast("success", "Request Sent", "Password reset request submitted to Admin Cell.");
    setLoginMode("login");
  };

  const handleForcedPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if(forcedNewPass.length < 6) { 
      showToast("warning", "Weak Password", "Minimum 6 characters required."); 
      return; 
    }
    changePasswordDirectly("faculty", currentFaculty!.email, simulateHash(forcedNewPass));
    setCurrentFaculty(prev => ({...prev!, hasChangedPassword: true, passwordHash: simulateHash(forcedNewPass)}));
    showToast("success", "Password Set", "Custom password securely configured!");
  };

  const handleSetWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableSubjectOptions.length === 0 && !isCoordinator) { 
      showToast("error", "Access Denied", `Unauthorized: No assigned subjects for Sem ${currentSem}.`); 
      return; 
    }
    if (!selectedBatch || !selectedSubject) { 
      showToast("warning", "Missing Selection", "Please select a batch and subject."); 
      return; 
    }
    setActiveTab(isCoordinatorMode ? "enrollment" : "matrix");
    setIsWorkspaceSet(true);
  };

  const [secCurrentPass, setSecCurrentPass] = useState("");
  const [secNewPass, setSecNewPass] = useState("");
  const [secConfirmPass, setSecConfirmPass] = useState("");

  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulateHash(secCurrentPass) !== currentFaculty?.passwordHash) { 
      showToast("error", "Auth Failed", "Incorrect current password!"); 
      return; 
    }
    if (secNewPass !== secConfirmPass) { 
      showToast("warning", "Mismatch", "New passwords do not match!"); 
      return; 
    }
    if (secNewPass.length < 6) { 
      showToast("warning", "Weak Password", "New password must be at least 6 characters."); 
      return; 
    }
    changePasswordDirectly("faculty", currentFaculty!.email, simulateHash(secNewPass));
    setCurrentFaculty(prev => ({...prev!, passwordHash: simulateHash(secNewPass)}));
    setSecCurrentPass(""); setSecNewPass(""); setSecConfirmPass("");
    showToast("success", "Security Updated", "Password changed successfully!");
  };

  const handleLogout = () => { setIsVerified(false); setIsWorkspaceSet(false); setCurrentFaculty(null); setInputPassword(""); setLoginMode("login"); };

  if (!isVerified || !currentFaculty) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 mx-auto flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">F</div>
            <h2 className="text-xl font-extrabold text-white">Faculty Portal Secure Login</h2>
          </div>
          {loginMode === "login" ? (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="relative"><Mail size={16} className="absolute left-3 top-3.5 text-slate-500" /><input type="email" required placeholder="Official Email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none focus:border-indigo-500" /></div>
              <div className="relative"><LockKeyhole size={16} className="absolute left-3 top-3.5 text-slate-500" /><input type="password" required placeholder="Password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none focus:border-indigo-500" /></div>
              <div className="flex justify-between items-center text-xs"><label className="flex items-center gap-1.5 text-slate-400"><input type="checkbox"/> Remember me</label><button type="button" onClick={() => setLoginMode("forgot")} className="text-indigo-400 hover:underline font-semibold cursor-pointer">Forgot Password?</button></div>
              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/20">Secure Login &rarr;</button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Faculty Password Reset Request</h3>
              <input type="email" required placeholder="Enter Institutional Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-indigo-500" />
              <input type="password" required placeholder="Desired New Password" value={resetNewPass} onChange={(e) => setResetNewPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-indigo-500" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">Request Admin Approval</button>
              <button type="button" onClick={() => setLoginMode("login")} className="w-full text-xs text-slate-400 hover:text-white mt-2 cursor-pointer">Back to Login</button>
            </form>
          )}
          <div className="text-center pt-2"><button onClick={() => navigate("/login")} className="text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer">&larr; Back to Role Selection</button></div>
        </div>
      </div>
    );
  }

  if (currentFaculty && currentFaculty.hasChangedPassword === false) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><KeyRound size={28}/></div>
            <h2 className="text-lg font-bold text-slate-900">Security Token Activation</h2>
            <p className="text-xs text-slate-500 mt-2">You are using the default system password. Please configure a personal password.</p>
          </div>
          <form onSubmit={handleForcedPasswordChange} className="space-y-4">
            <div><label className="text-xs font-bold text-slate-700 mb-1 block">New Custom Password</label><input type="password" required value={forcedNewPass} onChange={e => setForcedNewPass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-indigo-600"/></div>
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer">Set Secure Password & Enter Workspace</button>
          </form>
        </div>
      </div>
    );
  }

  if (isVerified && !isWorkspaceSet) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4"><h2 className="text-xl font-extrabold">Configure Active Workspace</h2></div>
          <form onSubmit={handleSetWorkspace} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Select Batch</label>
              <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none cursor-pointer">{batches.map((b, i) => <option key={i} value={b.name}>{b.name} [{b.dept}] - Sem {b.currentSemester}</option>)}</select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Subject (Sem {currentSem})</label>
              {availableSubjectOptions.length === 0 ? (
                <div className="w-full p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400 flex items-center gap-2"><ShieldAlert size={14}/> Not Assigned to any subject for Sem {currentSem}.</div>
              ) : (
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none cursor-pointer">{availableSubjectOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}</select>
              )}
            </div>
            <button type="submit" disabled={availableSubjectOptions.length === 0 && !isCoordinator} className={`w-full py-3 rounded-xl text-white text-xs font-semibold shadow-sm transition-all ${availableSubjectOptions.length === 0 && !isCoordinator ? "bg-slate-700 cursor-not-allowed opacity-50" : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"}`}>Launch Dashboard →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex text-[#111827]">
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800"><h1 className="text-xl font-extrabold text-white">CampusOS</h1></div>
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "security" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><ShieldCheck size={16} /> Profile & Security</button>
            <div className="h-px bg-slate-800 my-2"></div>
            
            {!isCoordinatorMode && (
              <>
                <button onClick={() => setActiveTab("matrix")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "matrix" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Award size={16} /> CIE Marks Matrix</button>
                <button onClick={() => setActiveTab("attendance")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "attendance" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Calendar size={16} /> Take Live Attendance</button>
                <button onClick={() => setActiveTab("ledger")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "ledger" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><BookOpen size={16} /> Attendance Ledger</button>
              </>
            )}
            
            {isCoordinator && (
              <>
                {isCoordinatorMode && <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-2 pb-1">Coordinator Tools</div>}
                <button onClick={() => setActiveTab("enrollment")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "enrollment" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Users size={16} /> Student Enrollment</button>
                <button onClick={() => setActiveTab("subjects")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "subjects" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><BookPlus size={16} /> Subject Selection</button>
                <button onClick={() => setActiveTab("assignment")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "assignment" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Network size={16} /> Faculty Assignment</button>
                <button onClick={() => setActiveTab("sgpa")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "sgpa" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Calculator size={16} /> SGPA & Conversions</button>
              </>
            )}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-border py-4 px-8 flex justify-between items-center shadow-xs">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted block">WORKSPACE</span><h2 className="text-xl font-bold text-[#111827]">Welcome, {currentFaculty?.firstName}</h2></div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"><LogOut size={14} /> Sign Out</button>
        </header>

        <main className="p-8 space-y-6">
          <div className="bg-[#0F172A] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Verified Active Workspace</div>
              <div className="text-sm font-bold mt-1 text-primary">{selectedBatch} <span className="bg-indigo-500/30 px-2 py-0.5 rounded text-indigo-100 ml-1 font-mono text-xs">Sem {currentSem}</span> <span className="text-slate-300 font-medium ml-2">| {selectedSubject}</span></div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border ${isCoordinatorMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : isCoordinator ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                <CheckCircle2 size={12} /> {isCoordinatorMode ? "Admin Mode Active" : isCoordinator ? "Coordinator & Faculty Access" : "Subject Faculty Access"}
              </span>
              <button onClick={() => setIsWorkspaceSet(false)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all cursor-pointer">
                <Edit3 size={12} /> Change Setup
              </button>
            </div>
          </div>

          {activeTab === "security" && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs max-w-xl animate-in fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <ShieldCheck size={24} className="text-primary"/>
                <div><h3 className="text-base font-bold text-[#111827]">Account Security Settings</h3><p className="text-xs text-muted">Update your login credentials securely.</p></div>
              </div>
              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Current Password</label><input type="password" required value={secCurrentPass} onChange={e=>setSecCurrentPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">New Password</label><input type="password" required value={secNewPass} onChange={e=>setNewPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" placeholder="Min 6 characters"/></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Confirm New Password</label><input type="password" required value={secConfirmPass} onChange={e=>setConfirmPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" /></div>
                <div className="pt-2"><button type="submit" className="px-5 py-2.5 bg-primary hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer">Update Password</button></div>
              </form>
            </div>
          )}

          {!isCoordinatorMode && activeTab === "matrix" && <CieMatrix selectedBatch={selectedBatch} selectedSubject={selectedSubject} batchStudents={batchStudents} studentMarksDb={studentMarksDb} subjects={subjects} batches={batches} attendanceRecords={attendanceRecords} saveSubjectInternalAndEse={saveSubjectInternalAndEse} submittedSubjects={submittedSubjects || {}} submitSubjectToCoordinator={submitSubjectToCoordinator} />}
          {!isCoordinatorMode && activeTab === "attendance" && <TakeAttendance selectedBatch={selectedBatch} selectedSubject={selectedSubject} batchStudents={batchStudents} attendanceRecords={attendanceRecords} saveAttendance={saveAttendance} />}
          {isCoordinatorMode && activeTab === "enrollment" && <BatchEnrollment selectedBatch={selectedBatch} batchStudents={batchStudents} addStudent={addStudent} deleteStudent={deleteStudent} />}
          {isCoordinatorMode && activeTab === "subjects" && <BatchSubjectSelection selectedBatch={selectedBatch} />}
          {isCoordinatorMode && activeTab === "assignment" && <BatchFacultyAssignment selectedBatch={selectedBatch} />}
          {isCoordinatorMode && activeTab === "sgpa" && <SgpaControl selectedBatch={selectedBatch} batchStudents={batchStudents} studentMarksDb={studentMarksDb} subjects={subjects} submittedSubjects={submittedSubjects || {}} coordinatorApprovals={coordinatorApprovals || {}} forwardBatchToAdmin={forwardBatchToAdmin} />}
          {!isCoordinatorMode && activeTab === "ledger" && <AttendanceLedger selectedBatch={selectedBatch} selectedSubject={selectedSubject} attendanceRecords={attendanceRecords} students={students} />}
        </main>
      </div>
    </div>
  );
};
export default FacultyLogin;
