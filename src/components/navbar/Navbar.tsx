import React, { useState, useEffect } from "react";
import { Logo } from "../common/Logo";
import { NavLinks } from "./NavLinks";
import { LoginButtons } from "./LoginButtons";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-border shadow-xs py-3.5"
          : "bg-background/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Logo />
        </div>

        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <div className="hidden lg:block">
          <LoginButtons />
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-muted hover:text-[#111827] hover:bg-border/50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-surface border-b border-border p-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <NavLinks className="flex-col items-start gap-4 mb-6" onItemClick={() => setMobileMenuOpen(false)} />
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <LoginButtons />
          </div>
        </div>
      )}
    </header>
  );
};

