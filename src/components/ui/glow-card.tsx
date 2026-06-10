import React from "react";
import { motion } from "motion/react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  tabIndex?: number;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  id,
  onClick,
  tabIndex,
}) => {
  return (
    <motion.div
      id={id}
      tabIndex={tabIndex}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      whileHover={{
        scale: 1.02,
        y: -1,
        transition: { type: "spring", stiffness: 350, damping: 22 },
      }}
      className={`
        relative overflow-hidden rounded-[24px] 
        border border-zinc-800/60 bg-zinc-950/40 p-6
        backdrop-blur-xl shadow-2xl transition-shadow duration-500
        hover:shadow-indigo-500/10 hover:border-zinc-700/60
        group ${onClick ? "cursor-pointer" : ""} ${className}
      `}
      aria-label={id ? `${id} card` : "Bento item"}
    >
      {/* Dynamic Animated Glow Effect inside Card margins */}
      <div 
        className="absolute -inset-px rounded-[24px] bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" 
      />

      {/* Modern Subtle Radial Lighting Glow */}
      <div 
        className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] opacity-60 pointer-events-none group-hover:bg-indigo-400/20 transition-all duration-700" 
      />
      <div 
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] opacity-40 pointer-events-none group-hover:bg-emerald-400/10 transition-all duration-700" 
      />

      {/* SaaS Grain/Noise Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] bg-repeat mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Authentic Content Container */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};
