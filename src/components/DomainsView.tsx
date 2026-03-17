import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlockedDomains } from "@/lib/store";
import { Plus, Trash2, Globe } from "lucide-react";

export function DomainsView() {
  const { domains, addDomain, removeDomain } = useBlockedDomains();
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState("Adult");

  const handleAdd = () => {
    if (!newDomain.trim()) return;
    addDomain(newDomain.trim().toLowerCase(), newCategory);
    setNewDomain("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Blocked Sites</h2>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter domain (e.g., example.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option>Adult</option>
          <option>Gambling</option>
          <option>Violence</option>
          <option>Drugs</option>
          <option>Other</option>
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <AnimatePresence mode="popLayout">
          {domains.map((d) => (
            <motion.div
              key={d.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Globe size={14} className="text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium">{d.domain}</p>
                  <p className="text-xs text-muted-foreground">{d.category}</p>
                </div>
              </div>
              <button
                onClick={() => removeDomain(d.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {domains.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No blocked domains</p>
        )}
      </div>
    </div>
  );
}
