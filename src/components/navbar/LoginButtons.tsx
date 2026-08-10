import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

export const LoginButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate("/documentation")}
        className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-surface text-[#111827] hover:bg-background transition-all shadow-xs"
      >
        <BookOpen size={14} className="text-muted" />
        Docs
      </button>

      <button
        onClick={() => navigate("/login")}
        className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm group cursor-pointer"
      >
        <span>Access Portals</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};

