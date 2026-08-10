export interface PortalInfo {
  id: string;
  name: string;
  description: string;
  route: string;
  badge: string;
  features: string[];
}

export const portals: PortalInfo[] = [
  {
    id: "student",
    name: "Student Portal",
    description: "Track attendance percentages, check transparent CIE/SEE grades, and simulate future academic outcomes.",
    route: "/login?role=student",
    badge: "Student Access",
    features: ["Attendance Risk Simulator", "SGPA/CGPA Analytics", "Real-time Workspace"],
  },
  {
    id: "faculty",
    name: "Faculty Portal",
    description: "Manage CBCS course rosters, input continuous internal evaluations, and run live class attendance.",
    route: "/login?role=faculty",
    badge: "Faculty & Batch Coordinator",
    features: ["Live Attendance Grid", "CIE Grade Freezing", "Batch Roster Control"],
  },
  {
    id: "admin",
    name: "Admin Portal",
    description: "Configure institutional grading policies, provision users, assign batch coordinators, and monitor campus analytics.",
    route: "/login?role=admin",
    badge: "System Governance",
    features: ["Department & Batch Setup", "Policy Engine", "Async Bulk Jobs"],
  },
];

