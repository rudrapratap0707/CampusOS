import React from "react";

interface NavLinksProps {
  className?: string;
  onItemClick?: () => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({ className = "", onItemClick }) => {
  const links = [
    { name: "Portals", href: "#portals" },
    { name: "Product Preview", href: "#preview" },
    { name: "About System", href: "#about" },
    { name: "Architecture Docs", href: "/documentation" },
  ];

  return (
    <nav className={`flex items-center gap-8 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={onItemClick}
          className="text-sm font-medium text-muted transition-colors hover:text-primary tracking-wide"
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

