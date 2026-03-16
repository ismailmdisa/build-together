import { useSettings } from "@/src/lib/store";
import { motion } from "framer-motion";
import { Shield, Search, Scan } from "lucide-react";

export function SettingsView() {
  const { settings, updateSettings } = useSettings();

  const filterLevels = [
    { id: "strict" as const, label: "Strict", desc: "Maximum protection. Blocks all potentially harmful content." },
    { id: "moderate" as const, label: "Moderate", desc: "Balanced filtering. Blocks explicit content, allows borderline." },
    { id: "light" as const, label: "Light", desc: "Minimal filtering. Only blocks clearly explicit content." },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Settings</h2>

      {/* Filter level */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Shield size={16} className="text-primary" /> Filter Level
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {filterLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => updateSettings({ filterLevel: level.id })}
              className={`p-4 rounded-lg border text-left transition-all ${
                settings.filterLevel === level.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <p className="font-semibold text-sm">{level.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <ToggleRow
          icon={<Scan size={18} className="text-primary" />}
          label="Real-Time Scanning"
          desc="Analyze page content in real-time using AI"
          enabled={settings.realTimeScanning}
          onToggle={() => updateSettings({ realTimeScanning: !settings.realTimeScanning })}
        />
        <ToggleRow
          icon={<Search size={18} className="text-primary" />}
          label="Safe Search"
          desc="Force safe search on all search engines"
          enabled={settings.safeSearch}
          onToggle={() => updateSettings({ safeSearch: !settings.safeSearch })}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-secondary"
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground"
          animate={{ left: enabled ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
