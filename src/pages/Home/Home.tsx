import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import { Logo } from "../../components/common/Logo";
import bgImage from "../../assets/images/BG.png";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white selection:bg-red-500/30 selection:text-white">
      
      {/* Background Image with Cinematic Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <header className="w-full px-6 lg:px-16 py-6 flex items-center justify-between">
          
          {/* Original Project Logo Component */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo size="sm" variant="light" />
          </div>

          {/* Right Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sm font-medium text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <User size={16} />
            <span>Login to Portal</span>
          </button>
        </header>

        {/* Hero Content Section */}
        <main className="flex-grow flex items-center px-6 lg:px-16 py-12 lg:py-20">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              One System. <br />
              Total <span className="text-red-500">Clarity.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              CampusOS unifies attendance, academics, performance, and analytics in one intelligent academic operating system.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-xl shadow-red-900/50 transition-all duration-300 cursor-pointer"
              >
                <span>Explore CampusOS</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default Home;