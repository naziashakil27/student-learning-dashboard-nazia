import React from "react";
import { Course } from "../../lib/types";
import { GlowCard } from "../ui/glow-card";
import { Trophy, Award, Lock, Unlock, ShieldAlert, CheckCircle, Zap } from "lucide-react";
import { motion } from "motion/react";

interface AchievementsViewProps {
  courses: Course[];
  streakDays: number;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  category: string;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  courses,
  streakDays,
}) => {
  // Compute badging rules dynamically from current courses & streak
  const hasReactPatternsComplete = courses.some(
    (c) => c.title.includes("React Patterns") && c.progress === 100
  );
  const hasTypeScriptComplete = courses.some(
    (c) => c.title.includes("TypeScript Mastery") && c.progress === 100
  );
  const hasFramerMotionComplete = courses.some(
    (c) => c.title.includes("Framer Motion") && c.progress === 100
  );
  
  const completedCount = courses.filter((c) => c.progress === 100).length;

  const badges: Badge[] = [
    {
      id: "streak-warrior",
      title: "Daily Consistencer",
      description: "Successfully log learning activity streak for several consecutive cycles.",
      requirement: "Achieve a streak count >= 3 days",
      unlocked: streakDays >= 3,
      category: "Engagement",
    },
    {
      id: "react- patterns",
      title: "React Design Patriarch",
      description: "Obtained deep understanding of advanced composition architecture & render hooks.",
      requirement: "Complete Advanced React Patterns (100%)",
      unlocked: hasReactPatternsComplete,
      category: "Skill Core",
    },
    {
      id: "typescript-god",
      title: "TypeScript Demigod",
      description: "Demonstrated advanced command of compiler generics, lookup types, and decorators.",
      requirement: "Complete TypeScript Mastery (100%)",
      unlocked: hasTypeScriptComplete,
      category: "Skill Core",
    },
    {
      id: "framer-master",
      title: "Orchestration Wizard",
      description: "Crafted intricate fluid micro-animations with layout morphing and physical spring constants.",
      requirement: "Complete Framer Motion Fundamentals (100%)",
      unlocked: hasFramerMotionComplete,
      category: "Core Animation",
    },
    {
      id: "polymath",
      title: "Curriculum Polymath",
      description: "Demonstrated exemplary multidisciplinary devotion by completing 3 distinct syllabuses.",
      requirement: "Successfully complete 3 courses",
      unlocked: completedCount >= 3,
      category: "Special Mastery",
    },
    {
      id: "initiator",
      title: "Initial Ignition spark",
      description: "Began journey inside active functional terminals to master core systems.",
      requirement: "Complete any course to at least 15%",
      unlocked: courses.some((c) => c.progress >= 15),
      category: "Welcome Badge",
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase">
            <Trophy size={12} className="text-zinc-500" />
            <span>Honors & Ranks</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Unlocked Achievements
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Realtime certificate lock logs. Progress update changes immediately compute and unlock badging items.
          </p>
        </div>
      </div>

      {/* Badges Grid of elements list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <GlowCard 
            key={badge.id}
            className={`p-6 border transition-all duration-300 ${
              badge.unlocked 
                ? "bg-zinc-950/80 border-indigo-500/10 shadow-indigo-500/5 hover:border-indigo-500/30" 
                : "bg-zinc-950/20 border-zinc-900/60 opacity-60 hover:opacity-85"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                badge.unlocked 
                  ? "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" 
                  : "text-zinc-500 bg-zinc-900 border-zinc-800/40"
              }`}>
                {badge.category}
              </span>

              {badge.unlocked ? (
                <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Unlock size={14} />
                </span>
              ) : (
                <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                  <Lock size={14} />
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className={`text-sm font-semibold font-sans ${badge.unlocked ? "text-white" : "text-zinc-500"}`}>
                {badge.title}
              </h3>
              <p className="text-xs text-zinc-400 font-sans line-clamp-3 leading-relaxed">
                {badge.unlocked ? badge.description : "This mastery rank remains currently encrypted. Satisfy pre-requisite metrics below to unlock."}
              </p>
            </div>

            {/* Pre-requisite info strip */}
            <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-500 uppercase">Pre-requisite:</span>
              <span className={`${badge.unlocked ? "text-emerald-400 font-medium" : "text-amber-500"}`}>
                {badge.unlocked ? "Unlocked & Verified" : badge.requirement}
              </span>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
};
