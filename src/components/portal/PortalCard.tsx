import React from "react";
import { PortalInfo } from "../../data/portals";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface PortalCardProps {
  portal: PortalInfo;
}

export const PortalCard: React.FC<PortalCardProps> = ({ portal }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-8 rounded-2xl border border-border bg-surface shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
            {portal.badge}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[#111827] tracking-tight mb-3 group-hover:text-primary transition-colors">
          {portal.name}
        </h3>

        <p className="text-sm text-muted leading-relaxed mb-6">
          {portal.description}
        </p>

        <div className="space-y-2.5 mb-8">
          {portal.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#111827]">
              <CheckCircle2 size={15} className="text-primary shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate(portal.route)}
        className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-background border border-border text-xs font-semibold text-[#111827] group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all cursor-pointer"
      >
        <span>Launch {portal.name}</span>
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

