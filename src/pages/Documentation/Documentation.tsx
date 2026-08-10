import React from "react";
import { MainLayout } from "../../layouts/MainLayout";

export const Documentation: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[#111827] mb-4">CampusOS Architecture Documentation</h1>
        <p className="text-muted text-base mb-8">
          Comprehensive technical specifications, PRD, TRD, and database schema mappings for the SmartERP AI enterprise platform.
        </p>
        <div className="p-6 rounded-xl bg-surface border border-border shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-[#111827]">Stack Overview</h3>
          <p className="text-xs text-muted">React + Vite, Tailwind CSS, Node.js Express, Prisma ORM, and PostgreSQL 16.</p>
        </div>
      </div>
    </MainLayout>
  );
};

