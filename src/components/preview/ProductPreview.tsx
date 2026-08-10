import React, { useState } from "react";
import { CheckCircle2, Shield, Cpu, Zap, Lock, BarChart3 } from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"attendance" | "grades" | "workspace">("attendance");

  return (
    <section id="preview" className="py-20 bg-surface border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Inside CampusOS Core Capabilities
          </h2>
          <p className="text-sm sm:text-base text-muted mt-3">
            Explore advanced workflows built to eliminate administrative friction and provide total academic clarity.
          </p>
        </div>

        {/* Interactive Tabs Header */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-xl bg-background border border-border shadow-xs">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "attendance"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-[#111827]"
              }`}
            >
              Attendance & Risk Simulator
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "grades"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-[#111827]"
              }`}
            >
              CBCS & CIE Grade Matrix
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "workspace"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-[#111827]"
              }`}
            >
              Encrypted Workspace
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-2xl border border-border bg-background p-8 md:p-12 shadow-sm">
          {activeTab === "attendance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary mb-4">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  Predictive Attendance & Risk Engine
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Monitor daily attendance percentages against mandatory regulatory thresholds ($75\%$) and non-condonable cutoffs ($65\%$)[cite: 3]. Students can test future absences using the interactive "What-If" simulator[cite: 3].
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>Automatic non-linear attendance bonus score mapping[cite: 3].</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>Real-time DX grade warning flags for shortage alerts[cite: 1, 3].</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
                  <span className="text-xs font-bold text-[#111827]">Subject Attendance Status</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">92.4% Overall</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>Data Structures (CSE-201)</span>
                      <span className="text-emerald-600 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>Operating Systems (CSE-203)</span>
                      <span className="text-primary font-bold">78%</span>
                    </div>
                    <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary mb-4">
                  <Cpu size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  CBCS & Dual-Barrier Evaluation
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Transparent continuous internal evaluations (CIE) combined with semester-end exams (SEE)[cite: 3]. Automated credit calculations using $L:T:P$ contact ratios[cite: 3].
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>Multi-university percentage converters (UGC, AICTE, VTU, MU)[cite: 3].</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>One-click faculty grade locking before publishing results[cite: 3].</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface border border-border shadow-xs font-mono text-xs space-y-3">
                <div className="text-slate-500 font-semibold">// CBCS Credit Formula</div>
                <div className="p-3 bg-background rounded-lg border border-border text-primary font-bold">
                  Total Credits = L + T + (P * 0.5)[cite: 3]
                </div>
                <div className="text-slate-500 font-semibold pt-2">// SGPA Calculation</div>
                <div className="p-3 bg-background rounded-lg border border-border text-[#111827]">
                  SGPA = sum(Credit * GradePoint) / sum(Credits)[cite: 3]
                </div>
              </div>
            </div>
          )}

          {activeTab === "workspace" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
              <div>
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary mb-4">
                  <Lock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  Real-Time Encrypted Workspaces
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Multi-user collaborative whiteboards and document editors powered by WebSockets and Yjs CRDTs, secured with client-side AES-GCM-256 encryption[cite: 1, 3].
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>Sub-50ms sync speed across active collaborative peers[cite: 4].</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-[#111827]">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span>Zero server visibility over client-side URL fragment keys[cite: 1].</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface border border-border shadow-xs flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Zap size={24} />
                </div>
                <h4 className="text-sm font-bold text-[#111827]">WebSocket + CRDT Mesh Active</h4>
                <p className="text-xs text-muted mt-1">Ready for collaborative student group projects and faculty office hours.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

