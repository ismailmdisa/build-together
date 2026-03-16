import { Shield, LayoutDashboard, Ban, Settings, Activity, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "domains", label: "Blocked Sites", icon: Ban },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <Shield className="text-primary" size={28} />
        <h1 className="text-lg font-bold font-[family-name:var(--font-display)] text-gradient">
          Guardian
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <item.icon size={18} className="relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground">Protection Status</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">Active</span>
        </div>
      </div>
    </aside>
  );
}
