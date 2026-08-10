import React, { useState } from "react";
import { User, Phone, MapPin, Mail, CreditCard, Shield, Edit2, KeyRound, Check, X, GraduationCap, CheckCircle2, Clock } from "lucide-react";
import { Student, useAcademic } from "../../context/AcademicContext";

interface Props {
  currentStudent: Student;
}

const StudentProfile: React.FC<Props> = ({ currentStudent }) => {
  const { requestProfileUpdate, profileRequests, changePasswordDirectly, simulateHash, batches, showToast } = useAcademic();
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(currentStudent.phone || "");
  const [editAddress, setEditAddress] = useState(currentStudent.address || "");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const pendingRequest = profileRequests.find(r => r.rollNo === currentStudent.rollNo && r.status === "Pending");
  const currentBatchObj = batches.find(b => b.name === currentStudent.batch);
  const currentSem = currentBatchObj?.currentSemester || 1;
  const session = currentBatchObj?.academicSession || "Current";

  const handleRequestUpdate = () => {
    requestProfileUpdate(currentStudent.rollNo, currentStudent.batch, editPhone, editAddress);
    setIsEditing(false);
    showToast("info", "Request Pending", "Profile update request sent to Coordinator for approval.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulateHash(currentPass) !== currentStudent.passwordHash) { 
      showToast("error", "Authentication Failed", "Incorrect current password!"); 
      return; 
    }
    if (newPass !== confirmPass) { 
      showToast("warning", "Mismatch", "New passwords do not match!"); 
      return; 
    }
    if (newPass.length < 6) { 
      showToast("warning", "Weak Password", "New password must be at least 6 characters."); 
      return; 
    }
    changePasswordDirectly("student", currentStudent.rollNo, simulateHash(newPass));
    setIsChangingPassword(false);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    showToast("success", "Security Updated", "Password updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ACADEMIC STATUS CARD */}
      <div className="bg-indigo-600 rounded-2xl p-6 shadow-sm text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={24} className="text-indigo-200" />
            <h2 className="text-xl font-bold tracking-tight">Academic Progression Status</h2>
          </div>
          <p className="text-indigo-100 text-sm">You are currently enrolled and active in the system.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="block text-[10px] uppercase tracking-wider text-indigo-200 font-bold">Academic Session</span>
            <span className="block text-lg font-bold">{session}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-center">
            <span className="block text-[10px] uppercase tracking-wider text-indigo-200 font-bold">Current Term</span>
            <span className="block text-lg font-bold">Semester {currentSem}</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><User size={20} /></div>
            <div>
              <h3 className="font-bold text-[#111827]">Core Identity</h3>
              <p className="text-[11px] text-muted uppercase tracking-wider">Unchangeable Records</p>
            </div>
          </div>
          <div className="space-y-4">
            <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Full Name</label><p className="font-semibold text-sm text-[#111827]">{currentStudent.firstName} {currentStudent.lastName}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Roll Number</label><p className="font-mono font-semibold text-primary">{currentStudent.rollNo}</p></div>
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Enrollment No</label><p className="font-mono text-sm text-[#111827]">{currentStudent.enrollmentNo || "N/A"}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Batch</label><p className="font-mono text-sm text-[#111827] bg-slate-100 w-fit px-2 py-0.5 rounded">{currentStudent.batch}</p></div>
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Institutional Email</label><p className="text-sm text-[#111827] truncate">{currentStudent.email}</p></div>
            </div>
            <div className="pt-2 border-t border-border grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Father's Name</label><p className="text-sm text-[#111827]">{currentStudent.fatherName || "N/A"}</p></div>
              <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Mother's Name</label><p className="text-sm text-[#111827]">{currentStudent.motherName || "N/A"}</p></div>
            </div>
          </div>
        </div>

        {/* Contact & Dynamic Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Edit2 size={20} /></div>
              <div>
                <h3 className="font-bold text-[#111827]">Contact Information</h3>
                <p className="text-[11px] text-muted uppercase tracking-wider">Request Updates</p>
              </div>
            </div>
            {!isEditing && !pendingRequest && (
              <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer">Edit</button>
            )}
          </div>

          {pendingRequest ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-full gap-2">
              <Clock className="text-amber-500" size={24} />
              <h4 className="font-bold text-amber-900 text-sm">Update Request Pending</h4>
              <p className="text-xs text-amber-700">Your request to update phone/address is awaiting Coordinator approval.</p>
            </div>
          ) : isEditing ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Phone Number</label><input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary" /></div>
                <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Residential Address</label><textarea rows={3} value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-primary resize-none" /></div>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => { setIsEditing(false); setEditPhone(currentStudent.phone); setEditAddress(currentStudent.address || ""); }} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"><X size={14} className="inline mr-1"/> Cancel</button>
                <button onClick={handleRequestUpdate} className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-indigo-700 cursor-pointer shadow-sm"><Check size={14} className="inline mr-1"/> Submit Request</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-3 items-start"><Phone className="text-slate-400 mt-0.5" size={16} /><div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Primary Phone</label><p className="font-semibold text-sm text-[#111827]">{currentStudent.phone || "Not Provided"}</p></div></div>
              <div className="flex gap-3 items-start"><MapPin className="text-slate-400 mt-0.5" size={16} /><div><label className="text-[10px] font-bold text-muted uppercase tracking-wider">Permanent Address</label><p className="text-sm text-[#111827] leading-relaxed">{currentStudent.address || "Not Provided"}</p></div></div>
            </div>
          )}
        </div>
      </div>

      {/* Security Engine */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Shield size={20} /></div>
            <div><h3 className="font-bold text-[#111827]">Account Security</h3><p className="text-[11px] text-muted uppercase tracking-wider">Manage Credentials</p></div>
          </div>
          {!isChangingPassword && (
            <button onClick={() => setIsChangingPassword(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"><KeyRound size={14}/> Change Password</button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4 animate-in fade-in">
            <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Current Password</label><input type="password" required value={currentPass} onChange={e=>setCurrentPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-emerald-500" /></div>
            <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">New Custom Password</label><input type="password" required value={newPass} onChange={e=>setNewPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-emerald-500" placeholder="Minimum 6 characters"/></div>
            <div><label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Confirm New Password</label><input type="password" required value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} className="w-full p-2.5 rounded-lg border border-border text-xs outline-none focus:border-emerald-500" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsChangingPassword(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer shadow-sm">Secure Update</button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 w-fit px-4 py-2 rounded-lg border border-emerald-200">
            <CheckCircle2 size={16}/> Your account is secured with a custom encrypted password.
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentProfile;
