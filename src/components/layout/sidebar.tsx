import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  Trophy, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Info
} from "lucide-react";
import { NavTab } from "../../lib/types";
import { Magnetic } from "../ui/magnetic";

interface SidebarProps {
  activeTab: NavTab;
  onActiveTabChange: (tab: NavTab) => void;
  userName: string;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onActiveTabChange,
  userName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "progress", label: "Progress", icon: BarChart2 },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`
        hidden md:flex flex-col h-screen fixed top-0 left-0 z-30
        bg-zinc-950/80 border-r border-zinc-900 backdrop-blur-xl
        p-4 select-none
      `}
    >
      {/* Brand Terminal Lockup */}
      <div className="flex items-center justify-between h-14 px-2 border-b border-zinc-900/60 pb-4 mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Magnetic strength={0.4} range={35}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20 cursor-pointer">
              <GraduationCap size={18} />
            </div>
          </Magnetic>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-sm font-sans font-semibold tracking-tight text-white leading-tight">
                  Nova Learn
                </span>
                <span className="text-[10px] font-mono font-medium text-indigo-400 tracking-wider">
                  SaaS OPERATIVE
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapsible toggle handle slider */}
        <Magnetic strength={0.5} range={40}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-white cursor-pointer hover:bg-zinc-800/80 hover:border-zinc-700 transition-all focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </Magnetic>
      </div>

      {/* Navigation items set */}
      <nav className="flex-1 space-y-1.5 py-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onActiveTabChange(item.id)}
              className={`
                relative w-full flex items-center gap-3 px-3 py-3 rounded-xl 
                text-sm font-medium transition-all group cursor-pointer text-left focus:outline-none
                ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"}
              `}
              aria-label={`Go to ${item.label}`}
            >
              {/* Sliding LayoutHighlight Morph using Framer Motion layoutId */}
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-zinc-900 border border-zinc-800/30 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {/* Icon component glyph */}
              <span className={`relative z-10 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                <Icon size={18} />
              </span>

              {/* Dynamic Label */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="relative z-10 text-xs font-sans tracking-tight"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Hover Dot Helper when collapsed */}
              {isCollapsed && (
                <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User status plate */}
      <div className="border-t border-zinc-900/60 pt-4 mt-auto">
        <div className={`flex items-center gap-3 p-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900/50 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500/20 to-indigo-500/30 border border-indigo-500/20 flex items-center justify-center text-white text-xs font-mono font-bold shrink-0 shadow-inner">
            {userName.charAt(0).toUpperCase()}
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[11px] font-sans font-medium text-white tracking-tight truncate">
                  {userName}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 truncate">
                  n-shakil@novalearn.sh
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
