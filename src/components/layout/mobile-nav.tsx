import React from "react";
import { motion } from "motion/react";
import { Home, BookOpen, BarChart2, Trophy, Settings } from "lucide-react";
import { NavTab } from "../../lib/types";

interface MobileNavProps {
  activeTab: NavTab;
  onActiveTabChange: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onActiveTabChange,
}) => {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "progress", label: "Stats", icon: BarChart2 },
    { id: "achievements", label: "Badges", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pointer-events-none">
      <nav className="max-w-md mx-auto h-16 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-2xl backdrop-blur-xl flex justify-around items-center px-2 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onActiveTabChange(item.id)}
              className="relative flex flex-col items-center justify-center py-1 w-12 h-12 rounded-xl transition-all select-none cursor-pointer focus:outline-none"
              aria-label={`Go to ${item.label}`}
            >
              {/* Active Morph Glow circle inside mobile nav element */}
              {isActive && (
                <motion.div
                  layoutId="active-mobile-nav"
                  className="absolute inset-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-400"}`}>
                <Icon size={20} />
              </span>

              <span className={`relative z-10 text-[9px] font-sans mt-1 font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-zinc-500"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
