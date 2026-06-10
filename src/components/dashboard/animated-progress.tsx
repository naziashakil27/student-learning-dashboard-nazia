import React from "react";
import { motion } from "motion/react";

interface AnimatedProgressProps {
  value: number; // 0 to 100
  colorClassName?: string;
  delay?: number;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  colorClassName = "from-indigo-500 to-emerald-400",
  delay = 0.2,
}) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse" />
          Completion
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay }}
          className="text-white font-bold"
        >
          {safeValue}%
        </motion.span>
      </div>

      {/* Progress Track */}
      <div className="relative h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-zinc-800/40">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${safeValue}%` }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay,
          }}
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${colorClassName}`}
        />
        
        {/* Shimmer light flare on progress track */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      </div>
    </div>
  );
};
