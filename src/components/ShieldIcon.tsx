import { motion } from "framer-motion";

interface ShieldIconProps {
  active: boolean;
  size?: number;
}

export function ShieldIcon({ active, size = 120 }: ShieldIconProps) {
  return (
    <motion.div
      className="relative"
      animate={active ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={active ? "shield-pulse" : ""}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={active ? "hsl(152, 60%, 45%)" : "hsl(0, 0%, 35%)"} />
            <stop offset="100%" stopColor={active ? "hsl(152, 80%, 60%)" : "hsl(0, 0%, 50%)"} />
          </linearGradient>
          <linearGradient id="shieldInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={active ? "hsl(152, 60%, 45%)" : "hsl(0, 0%, 35%)"} stopOpacity="0.2" />
            <stop offset="100%" stopColor={active ? "hsl(152, 60%, 45%)" : "hsl(0, 0%, 35%)"} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* Shield body */}
        <path
          d="M60 10 L100 30 L100 60 C100 85 80 105 60 112 C40 105 20 85 20 60 L20 30 Z"
          fill="url(#shieldInner)"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
        />
        {/* Check mark or X */}
        {active ? (
          <motion.path
            d="M42 60 L54 72 L78 48"
            stroke="hsl(152, 60%, 50%)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <>
            <line x1="45" y1="45" x2="75" y2="75" stroke="hsl(0, 0%, 45%)" strokeWidth="4" strokeLinecap="round" />
            <line x1="75" y1="45" x2="45" y2="75" stroke="hsl(0, 0%, 45%)" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
      </svg>
    </motion.div>
  );
}
