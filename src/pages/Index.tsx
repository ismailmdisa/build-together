import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { ActivityView } from "@/components/ActivityView";
import { DomainsView } from "@/components/DomainsView";
import { AlertsView } from "@/components/AlertsView";
import { SettingsView } from "@/components/SettingsView";
import { Menu, X } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView />;
      case "activity": return <ActivityView />;
      case "domains": return <DomainsView />;
      case "alerts": return <AlertsView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold font-[family-name:var(--font-display)] text-gradient">Guardian</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:pt-0 pt-14 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
