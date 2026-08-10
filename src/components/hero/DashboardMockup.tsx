import React from "react";
import { LayoutDashboard, Users, BookOpen, ShieldAlert, TrendingUp } from "lucide-react";

export const DashboardMockup: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16">
      <div className="rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        {/* Mockup Header Bar */}
        <div className="bg-[#111827] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-md">
            campusos.edu/enterprise/dashboard
          </div>
          <div className="text-xs text-slate-400 font-medium">v1.0.0 Production</div>
        </div>

        {/* Mockup Dashboard Content */}
        <div className="p-6 md:p-8 bg-background grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mini Sidebar */}
          <div className="hidden md:flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              <LayoutDashboard size={16} /> Overview
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted text-xs font-medium hover:bg-background">
              <Users size={16} /> Roster & Batches
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted text-xs font-medium hover:bg-background">
              <BookOpen size={16} /> CBCS Courses
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted text-xs font-medium hover:bg-background">
              <ShieldAlert size={16} /> Audit Logs
            </div>
          </div>

          {/* Main Display Panel */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border shadow-xs">
                <span className="text-xs font-medium text-muted">Active Attendance</span>
                <h3 className="text-2xl font-bold text-[#111827] mt-1">92.4%</h3>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Healthy Threshold</span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border shadow-xs">
                <span className="text-xs font-medium text-muted">Batch SGPA Avg</span>
                <h3 className="text-2xl font-bold text-[#111827] mt-1">8.62</h3>
                <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">+0.4 from last term</span>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border shadow-xs">
                <span className="text-xs font-medium text-muted">Pending CIE Locks</span>
                <h3 className="text-2xl font-bold text-[#111827] mt-1">0</h3>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">All Grades Synced</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-surface border border-border shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Real-Time Analytics & Risk Engine Active</h4>
                  <p className="text-xs text-muted mt-0.5">Automated non-linear attendance bonus calculations running seamlessly.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-lg bg-primary text-primary-foreground">
                Live Sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

