import { useSettings } from "@/lib/store";
import { Bell, BellOff, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function AlertsView() {
  const { settings, updateSettings } = useSettings();

  const handleTestAlert = () => {
    if (!settings.partnerEmail) {
      toast.error("Please configure a partner email first");
      return;
    }
    toast.success(`Test alert sent to ${settings.partnerName || settings.partnerEmail}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Accountability Alerts</h2>
      <p className="text-muted-foreground text-sm">
        Configure an accountability partner who will be notified when concerning content is detected.
      </p>

      {/* Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.alertsEnabled ? (
              <Bell className="text-primary" size={20} />
            ) : (
              <BellOff className="text-muted-foreground" size={20} />
            )}
            <div>
              <p className="font-medium text-sm">Partner Alerts</p>
              <p className="text-xs text-muted-foreground">Notify your accountability partner of violations</p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ alertsEnabled: !settings.alertsEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.alertsEnabled ? "bg-primary" : "bg-secondary"
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground"
              animate={{ left: settings.alertsEnabled ? 26 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Partner details */}
      {settings.alertsEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <h3 className="font-semibold text-sm">Partner Information</h3>
          
          <div className="space-y-3">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Partner name"
                value={settings.partnerName}
                onChange={(e) => updateSettings({ partnerName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Partner email"
                value={settings.partnerEmail}
                onChange={(e) => updateSettings({ partnerEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Partner phone (optional)"
                value={settings.partnerPhone}
                onChange={(e) => updateSettings({ partnerPhone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <button
            onClick={handleTestAlert}
            className="px-4 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            Send Test Alert
          </button>
        </motion.div>
      )}
    </div>
  );
}
