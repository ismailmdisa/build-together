import { ShieldCheck, ShieldOff, Ban, AlertTriangle, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ShieldIcon } from "./ShieldIcon";
import { StatusCard } from "./StatusCard";
import { useSettings, useBlockedDomains, useActivityLog } from "@/lib/store";

export function DashboardView() {
  const { settings, updateSettings } = useSettings();
  const { domains } = useBlockedDomains();
  const { logs } = useActivityLog();

  const blockedCount = logs.filter((l) => l.type === "blocked").length;
  const warningCount = logs.filter((l) => l.type === "warning").length;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Hero status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border p-8 flex items-center gap-8 ${
          settings.protectionEnabled
            ? "border-success/20 bg-gradient-to-br from-success/5 to-transparent glow-green"
            : "border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent glow-red"
        }`}
      >
        <ShieldIcon active={settings.protectionEnabled} size={100} />
        <div className="flex-1">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
            {settings.protectionEnabled ? "Protection Active" : "Protection Disabled"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {settings.protectionEnabled
              ? `Filtering at ${settings.filterLevel} level • ${domains.length} sites blocked`
              : "Your device is currently unprotected. Enable protection to stay safe."}
          </p>
          <button
            onClick={() => updateSettings({ protectionEnabled: !settings.protectionEnabled })}
            className={`mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              settings.protectionEnabled
                ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
                : "bg-success text-success-foreground hover:brightness-110"
            }`}
          >
            {settings.protectionEnabled ? (
              <span className="flex items-center gap-2"><ShieldOff size={16} /> Disable Protection</span>
            ) : (
              <span className="flex items-center gap-2"><ShieldCheck size={16} /> Enable Protection</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard icon={Ban} label="Blocked Today" value={blockedCount} variant="danger" />
        <StatusCard icon={AlertTriangle} label="Warnings" value={warningCount} variant="warning" />
        <StatusCard icon={Eye} label="Sites Monitored" value={domains.length} variant="success" />
        <StatusCard icon={Clock} label="Filter Level" value={settings.filterLevel} variant="default" />
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] mb-4">Recent Activity</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {logs.slice(0, 5).map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    log.type === "blocked" ? "bg-destructive" : log.type === "warning" ? "bg-warning" : "bg-success"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{log.domain}</p>
                  <p className="text-xs text-muted-foreground">{log.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    log.type === "blocked"
                      ? "bg-destructive/10 text-destructive"
                      : log.type === "warning"
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {log.type}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
