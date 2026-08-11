import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, User, ArrowLeft } from "lucide-react";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <button 
          onClick={() => navigate("/")} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-semibold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Landing Page
        </button>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Select Your Role</h1>
          <p className="text-slate-500 mt-2">Choose your designated portal to securely access CampusOS</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Option */}
          <div onClick={() => navigate("/login/admin")} className="cursor-pointer group border border-slate-200 hover:border-primary hover:shadow-lg rounded-xl p-6 text-center transition-all bg-white">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Shield size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Admin Root</h3>
            <p className="text-xs text-slate-500 mt-2">System configuration, governance & policy control</p>
          </div>
          
          {/* Faculty Option */}
          <div onClick={() => navigate("/login/faculty")} className="cursor-pointer group border border-slate-200 hover:border-indigo-500 hover:shadow-lg rounded-xl p-6 text-center transition-all bg-white">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Faculty Portal</h3>
            <p className="text-xs text-slate-500 mt-2">Attendance marking, grading & batch management</p>
          </div>
          
          {/* Student Option */}
          <div onClick={() => navigate("/login/student")} className="cursor-pointer group border border-slate-200 hover:border-emerald-500 hover:shadow-lg rounded-xl p-6 text-center transition-all bg-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <User size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
            <p className="text-xs text-slate-500 mt-2">Academic records, performance & risk simulator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
