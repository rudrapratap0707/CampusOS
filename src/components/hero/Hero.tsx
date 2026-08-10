import React from "react";
import { HeroContent } from "./HeroContent";
import { DashboardMockup } from "./DashboardMockup";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <HeroContent />
        <DashboardMockup />
      </div>
    </section>
  );
};

