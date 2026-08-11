import React from "react";
import { GraduationCap } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark"; // Added variant to handle dark/light backgrounds seamlessly
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md", variant = "dark" }) => {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  // Dynamic text colors based on background variant
  const textColor = variant === "light" ? "text-white" : "text-[#111827]";
  const subTextColor = variant === "light" ? "text-slate-300" : "text-slate-500";

  return (
    <div className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      <div className="flex items-center justify-center rounded-xl bg-red-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105 p-2">
        <GraduationCap size={iconSizes[size]} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight ${textColor} text-lg leading-none`}>
          Campus<span className="text-red-500">OS</span>
        </span>
        <span className={`text-[10px] font-medium tracking-widest uppercase ${subTextColor} mt-0.5`}>
          Academic ERP
        </span>
      </div>
    </div>
  );
};

export default Logo;
