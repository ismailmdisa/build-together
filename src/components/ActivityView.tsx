import { motion } from "framer-motion";
import { useActivityLog } from "@/src/lib/store";
import { Filter } from "lucide-react";
import { useState } from "react";

export function ActivityView() {
  const { logs } = useActivityLog();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Activity Log</h2>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          {["all", "blocked", "warning", "allowed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No activity found</p>
        ) : (
          filtered.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    log.type === "blocked" ? "bg-destructive" : log.type === "warning" ? "bg-warning" : "bg-success"
                  }`}
                />
                <div>
                  <p className="font-medium text-sm">{log.domain}</p>
                  <p className="text-xs text-muted-foreground">{log.category} • {new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${
                  log.type === "blocked"
                    ? "bg-destructive/10 text-destructive"
                    : log.type === "warning"
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
                }`}
              >
                {log.type}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
