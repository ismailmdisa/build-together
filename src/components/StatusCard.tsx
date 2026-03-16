import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "border-border",
  success: "border-success/30 glow-green",
  warning: "border-warning/30",
  danger: "border-destructive/30 glow-red",
};

const iconVariantClasses = {
  default: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatusCard({ icon: Icon, label, value, variant = "default" }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border bg-card p-5 ${variantClasses[variant]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-secondary ${iconVariantClasses[variant]}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{value}</p>
    </motion.div>
  );
}
