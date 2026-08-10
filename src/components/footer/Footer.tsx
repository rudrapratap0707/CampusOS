import React from "react";
import { Logo } from "../common/Logo";
import { siteConfig } from "../../config/site";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-surface border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/documentation")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-muted hover:text-[#111827] transition-colors cursor-pointer"
              >
                <BookOpen size={16} />
                <span>View Documentation</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs font-medium text-muted">
              <li><a href="/login?role=student" className="hover:text-primary transition-colors">Student Portal</a></li>
              <li><a href="/login?role=faculty" className="hover:text-primary transition-colors">Faculty Portal</a></li>
              <li><a href="/login?role=admin" className="hover:text-primary transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium text-muted">
              <li><a href="/documentation" className="hover:text-primary transition-colors">Architecture Docs</a></li>
              <li><a href="#preview" className="hover:text-primary transition-colors">Product Preview</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">System Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Enterprise Academic Resource Planning System</p>
        </div>
      </div>
    </footer>
  );
};

