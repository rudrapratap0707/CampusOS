import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-12 pb-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 tracking-wide shadow-xs">
        <Sparkles size={14} className="animate-pulse" />
        <span>Next-Gen Academic Resource Planning OS</span>
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] leading-[1.1] mb-6">
        The Operating System for <span className="text-primary underline decoration-primary/30 underline-offset-8">Modern Higher Education</span>
      </h1>

      <p className="text-lg sm:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
        Unified enterprise ERP for students, faculty, and administrators. Featuring automated CBCS credit tracking, real-time attendance risk engines, and transparent evaluations.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <button
          onClick={() => navigate("/login")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md group cursor-pointer text-base"
        >
          <span>Explore Portals</span>
          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <a
          href="#portals"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface text-[#111827] font-semibold hover:bg-background transition-all shadow-xs text-base"
        >
          View System Architecture
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-border/60 w-full text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111827]">Strict ACID Compliance</h4>
            <p className="text-xs text-muted mt-0.5">PostgreSQL & Prisma powered data integrity.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
            <Cpu size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111827]">Batch & Role Security</h4>
            <p className="text-xs text-muted mt-0.5">Granular coordinator & teacher access control.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

