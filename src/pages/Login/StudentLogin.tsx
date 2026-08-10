import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Award, LogOut, Sliders, ShieldCheck, Mail, UserCircle, KeyRound, LockKeyhole, FileSpreadsheet } from "lucide-react";
import { useAcademic, Student } from "../../context/AcademicContext";
import AttendanceMatrix from "../../components/Student/AttendanceMatrix";
import RiskSimulator from "../../components/Student/RiskSimulator";
import MarksDashboard from "../../components/Student/MarksDashboard";
import StudentProfile from "../../components/Student/StudentProfile";
import StudentMarksheet from "../../components/Student/StudentMarksheet";

export const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    subjects, batches, condonationLimit, students, attendanceRecords, 
    studentMarksDb, publishedBatches, batchSelectedSubjects, 
    requestPasswordReset, changePasswordDirectly, simulateHash,
    showToast // IMPORTED NOTIFICATION ENGINE
  } = useAcademic();

  const [loginMode, setLoginMode] = useState<"login" | "forgot">("login");
  const [isVerified, setIsVerified] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  const [resetRollNo, setResetRollNo] = useState("");
  const [resetBatch, setResetBatch] = useState(batches[0]?.name || "");
  const [resetNewPass, setResetNewPass] = useState("");
  const [forcedNewPass, setForcedNewPass] = useState("");

  const [activeTab, setActiveTab] = useState<"attendance" | "simulator" | "marks" | "marksheet" | "profile">("attendance");

  useEffect(() => {
    if (isVerified && currentStudent) {
      const liveStudentData = students.find(s => s.rollNo === currentStudent.rollNo);
      if (liveStudentData && (liveStudentData.batch !== currentStudent.batch || liveStudentData.hasChangedPassword !== currentStudent.hasChangedPassword)) {
        setCurrentStudent(liveStudentData);
      }
    }
  }, [students, isVerified, currentStudent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = students.find(s => s.email.toLowerCase() === inputEmail.toLowerCase());
    if (found) {
      if (found.passwordHash === simulateHash(inputPassword) || !found.passwordHash) {
        setCurrentStudent(found);
        setIsVerified(true);
      } else { 
        showToast("error", "Login Failed", "Invalid credentials! Incorrect password."); 
      }
    } else { 
      showToast("error", "Not Found", "Student email not found in institutional database!"); 
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const checkSt = students.find(s => s.rollNo === resetRollNo && s.batch === resetBatch);
    if (!checkSt) { 
      showToast("error", "Verification Failed", "Student details do not match our records."); 
      return; 
    }
    requestPasswordReset("student", resetRollNo, simulateHash(resetNewPass), resetBatch);
    showToast("success", "Request Sent", "Password reset request submitted to your Batch Coordinator.");
    setLoginMode("login");
  };

  const handleForcedPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if(forcedNewPass.length < 6) { 
      showToast("warning", "Weak Password", "Password must be at least 6 characters."); 
      return; 
    }
    changePasswordDirectly("student", currentStudent!.rollNo, simulateHash(forcedNewPass));
    setCurrentStudent(prev => ({...prev!, hasChangedPassword: true, passwordHash: simulateHash(forcedNewPass)}));
    showToast("success", "Account Secured", "Security Token consumed. Custom password successfully configured!");
  };

  const handleLogout = () => { setIsVerified(false); setCurrentStudent(null); setInputPassword(""); setLoginMode("login"); };

  if (!isVerified || !currentStudent) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center font-sans px-4 print:hidden">
        <div className="max-w-md w-full bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">S</div>
            <h2 className="text-xl font-extrabold text-white">Student Portal Secure Login</h2>
            <p className="text-xs text-slate-400">Default Password for new enrollees is: Student@2026</p>
          </div>
          
          {loginMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><Mail size={16} className="absolute left-3 top-3.5 text-slate-500" /><input type="email" required placeholder="Official Email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none focus:border-primary" /></div>
              <div className="relative"><LockKeyhole size={16} className="absolute left-3 top-3.5 text-slate-500" /><input type="password" required placeholder="Password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white outline-none focus:border-primary" /></div>
              <div className="flex justify-between items-center text-xs"><label className="flex items-center gap-1.5 text-slate-400"><input type="checkbox"/> Remember me</label><button type="button" onClick={() => setLoginMode("forgot")} className="text-primary hover:underline font-semibold cursor-pointer">Forgot Password?</button></div>
              <button type="submit" className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-primary/20">Secure Login &rarr;</button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2">Reset Password Request</h3>
              <input type="text" required placeholder="Enter Roll Number" value={resetRollNo} onChange={(e) => setResetRollNo(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-primary" />
              <select required value={resetBatch} onChange={(e) => setResetBatch(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-primary">{batches.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}</select>
              <input type="password" required placeholder="Enter Desired New Password" value={resetNewPass} onChange={(e) => setResetNewPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-primary" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer">Request Coordinator Approval</button>
              <button type="button" onClick={() => setLoginMode("login")} className="w-full text-xs text-slate-400 hover:text-white mt-2 cursor-pointer">Back to Login</button>
            </form>
          )}
          <div className="text-center pt-2"><button onClick={() => navigate("/login")} className="text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer">&larr; Back to Role Selection</button></div>
        </div>
      </div>
    );
  }

  if (currentStudent && currentStudent.hasChangedPassword === false) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"><KeyRound size={28}/></div>
            <h2 className="text-lg font-bold text-slate-900">Security Token Activation</h2>
            <p className="text-xs text-slate-500 mt-2">You are using the default system password. Please configure a personal password.</p>
          </div>
          <form onSubmit={handleForcedPasswordChange} className="space-y-4">
            <div><label className="text-xs font-bold text-slate-700 mb-1 block">New Custom Password</label><input type="password" required value={forcedNewPass} onChange={e => setForcedNewPass(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-primary" placeholder="Minimum 6 characters"/></div>
            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer">Set Secure Password & Enter Workspace</button>
          </form>
        </div>
      </div>
    );
  }

  const currentBatchObj = batches.find(b => b.name === currentStudent.batch);
  const currentSem = currentBatchObj?.currentSemester || 1;
  const activeSubjectCodes = batchSelectedSubjects[`${currentStudent.batch}_${currentSem}`] || [];
  const currentSemSubjects = subjects.filter(s => activeSubjectCodes.includes(s.code));

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex text-[#111827]">
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between hidden md:flex shrink-0 print:hidden">
        <div>
          <div className="p-6 border-b border-slate-800"><h1 className="text-xl font-extrabold text-white tracking-tight">CampusOS</h1></div>
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "profile" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><UserCircle size={16} /> Student Details</button>
            <button onClick={() => setActiveTab("attendance")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "attendance" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Clock size={16} /> My Attendance</button>
            <button onClick={() => setActiveTab("simulator")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "simulator" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Sliders size={16} /> Risk Predictor Engine</button>
            <button onClick={() => setActiveTab("marks")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "marks" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><Award size={16} /> Official Grade Card</button>
            <button onClick={() => setActiveTab("marksheet")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "marksheet" ? "bg-primary text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"}`}><FileSpreadsheet size={16} /> Statement of Marks</button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col gap-1.5 print:hidden">
          <span className="flex items-center gap-1 text-emerald-400 font-bold mb-1"><ShieldCheck size={14}/> Verified Identity</span>
          <span>Roll: <span className="font-mono text-slate-300">{currentStudent.rollNo}</span></span>
          <span className="flex items-center gap-1.5">
            Batch: <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">{currentStudent.batch}</span>
            <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Sem {currentSem}</span>
          </span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-border py-4 px-8 flex justify-between items-center shadow-xs print:hidden">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-muted block">Student Intelligence Workspace</span><h2 className="text-xl font-bold text-[#111827]">Welcome, {currentStudent.firstName} {currentStudent.lastName}</h2></div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 cursor-pointer shadow-xs transition-colors"><LogOut size={14} /> Sign Out</button>
        </header>

        <main className="p-8 space-y-6">
          {activeTab === "profile" && <div className="print:hidden"><StudentProfile currentStudent={currentStudent} /></div>}
          
          {activeTab === "attendance" && (
            <div className="print:hidden">
              <AttendanceMatrix currentStudent={currentStudent} subjects={currentSemSubjects} attendanceRecords={attendanceRecords} condonationLimit={condonationLimit} />
            </div>
          )}
          
          {activeTab === "simulator" && (
            <div className="print:hidden">
              <RiskSimulator 
                subjects={currentSemSubjects} 
                attendanceStats={currentSemSubjects.map(sub => { 
                  const subRecords = attendanceRecords.filter(r => r.batch === currentStudent.batch && (r.semester || 1) === currentSem && r.subject.includes(sub.code)); 
                  const totalHeld = subRecords.length; 
                  const attended = subRecords.filter(r => { const stRec = r.records.find(sr => sr.rollNo === currentStudent.rollNo); return stRec && stRec.status === "Present"; }).length; 
                  const percentage = totalHeld === 0 ? 100 : Math.round((attended / totalHeld) * 100); 
                  let bonus = 0; if (percentage >= 90) bonus = 5; else if (percentage >= 85) bonus = 4; else if (percentage >= 80) bonus = 3; else if (percentage >= 75) bonus = 2; 
                  return { ...sub, totalHeld, attended, percentage, bonus }; 
                })} 
                condonationLimit={condonationLimit} 
              />
            </div>
          )}
          
          {activeTab === "marks" && <div className="print:hidden"><MarksDashboard currentStudent={currentStudent} studentMarksDb={studentMarksDb} subjects={subjects} batches={batches} publishedBatches={publishedBatches} /></div>}
          
          {activeTab === "marksheet" && <StudentMarksheet currentStudent={currentStudent} studentMarksDb={studentMarksDb} subjects={subjects} batches={batches} publishedBatches={publishedBatches} />}
        </main>
      </div>
    </div>
  );
};
export default StudentLogin;
