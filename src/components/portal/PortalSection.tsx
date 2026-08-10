import React from "react";
import { portals } from "../../data/portals";
import { PortalCard } from "./PortalCard";

export const PortalSection: React.FC = () => {
  return (
    <section id="portals" className="py-20 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            Role-Based Portals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-sm sm:text-base text-muted mt-3">
            Secure and isolated workflows built specifically for students, faculty coordinators, and administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <PortalCard key={portal.id} portal={portal} />
          ))}
        </div>
      </div>
    </section>
  );
};

