import React from "react";
import { ShieldCheck, Database, Zap, Users } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
              Institutional Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] mb-6">
              Built for Enterprise Security and Complete Transparency
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
              CampusOS replaces legacy, opaque academic software with a rigorous ACID-compliant relational core[cite: 3]. By combining strict batch coordinator hierarchies with automated background processing queues, institutions achieve absolute operational reliability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-surface border border-border shadow-xs">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                  <Database size={20} />
                </div>
                <h4 className="text-sm font-bold text-[#111827] mb-1">PostgreSQL & Prisma</h4>
                <p className="text-xs text-muted">Strict relational integrity preventing data corruption across academic terms.</p>
              </div>

              <div className="p-5 rounded-xl bg-surface border border-border shadow-xs">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                  <Users size={20} />
                </div>
                <h4 className="text-sm font-bold text-[#111827] mb-1">Batch Hierarchies</h4>
                <p className="text-xs text-muted">Granular access control enforcing coordinator and subject teacher boundaries.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-surface shadow-md">
            <h3 className="text-xl font-bold text-[#111827] mb-4">System Trust Pillars</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <ShieldCheck size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <h5 className="text-sm font-semibold text-[#111827]">Argon2id & JWT Authentication</h5>
                  <p className="text-xs text-muted mt-0.5">Secure session handling with HttpOnly cookies and multi-factor role validation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Zap size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <h5 className="text-sm font-semibold text-[#111827]">BullMQ Async Workers</h5>
                  <p className="text-xs text-muted mt-0.5">Offloading bulk transcript generation and PDF exports to background Redis queues[cite: 1, 3].</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

