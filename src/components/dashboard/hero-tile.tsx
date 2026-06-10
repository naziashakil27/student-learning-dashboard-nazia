import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlowCard } from "../ui/glow-card";
import { Zap, Trophy, Flame, Sparkles, BookOpen, Clock, Edit2, Check } from "lucide-react";
import { Course } from "../../lib/types";
import { Magnetic } from "../ui/magnetic";

interface HeroTileProps {
  courses: Course[];
  userName: string;
  onUpdateUserName: (name: string) => void;
  onLogStudyTime: () => void;
  streakDays: number;
}

export const HeroTile: React.FC<HeroTileProps> = ({
  courses,
  userName,
  onUpdateUserName,
  onLogStudyTime,
  streakDays,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [showParticle, setShowParticle] = useState(false);

  // Compute calculated metrics
  const totalCoursesCount = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const inProgressCourses = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
  
  const overallProgressSum = courses.length > 0 
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0;

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateUserName(editedName.trim());
      setIsEditingName(false);
    }
  };

  const executeStudyLog = () => {
    onLogStudyTime();
    setShowParticle(true);
    setTimeout(() => {
      setShowParticle(false);
    }, 1000);
  };

  return (
    <GlowCard className="col-span-1 md:col-span-2 lg:col-span-4 p-8 bg-zinc-950/60 border border-zinc-800/80">
      <div className="flex flex-col lg:flex-row justify-between gap-8 h-full">
        {/* Left Side: Welcome and Greeting */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-medium text-indigo-400">
              <Sparkles size={12} className="animate-pulse text-indigo-400" />
              <span>ACADEMIC TERMINAL SECURE SESSION</span>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={editedName}
                    maxLength={20}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white font-sans text-2xl md:text-3xl font-bold tracking-tight px-3 py-1 rounded-xl outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") {
                        setEditedName(userName);
                        setIsEditingName(false);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    aria-label="Save name"
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group/name">
                  <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-zinc-100 to-indigo-300">{userName}</span>
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    aria-label="Edit name"
                    className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/50 opacity-0 group-hover/name:opacity-100 transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl font-sans font-light leading-relaxed">
              Your curriculum is currently synchronizing with Supabase API. You have completed <strong className="text-indigo-300">{completedCourses}</strong> of <strong className="text-zinc-200">{totalCoursesCount}</strong> total masteries. Keep going!
            </p>
          </div>

          {/* User statistics dashboard strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-900">
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Completion Rate</span>
              <span className="text-xl md:text-2xl font-bold text-white font-sans mt-1">
                {overallProgressSum}%
              </span>
            </div>
            
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Studies Logged</span>
              <span className="text-xl md:text-2xl font-bold text-white font-sans mt-1 flex items-center gap-1.5">
                <Clock size={16} className="text-indigo-400" />
                {courses.reduce((sum, c) => sum + Math.round(c.progress * 0.4), 12)}h
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Completed Certs</span>
              <span className="text-xl md:text-2xl font-bold text-emerald-400 font-sans mt-1 flex items-center gap-1.5">
                <Trophy size={16} />
                {completedCourses}
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Target Focus</span>
              <span className="text-xl md:text-2xl font-bold text-zinc-300 font-sans mt-1">
                {inProgressCourses} Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Daily Learning Streak Widget */}
        <div className="flex flex-col justify-between items-center bg-zinc-900/20 border border-zinc-900 p-6 rounded-[24px] text-center min-w-[240px] relative overflow-hidden group/streak">
          {/* Internal gradient light */}
          <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-3xl group-hover/streak:bg-indigo-500/10 transition-colors" />

          <div className="relative z-10 space-y-1">
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">STREAK VELOCITY</span>
            <div className="text-zinc-500 text-xs">Learn every 24 hours</div>
          </div>

          {/* Centered Fire Particle Aura & Big Indicator */}
          <div className="relative z-10 my-4 flex items-center justify-center">
            <AnimatePresence>
              {showParticle && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 1, y: 0 }}
                  animate={{ scale: 2, opacity: 0, y: -45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute pointer-events-none text-orange-500 z-20"
                >
                  <Flame size={44} fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>

            <Magnetic strength={0.3} range={60}>
              <motion.div
                animate={{
                  scale: showParticle ? [1, 1.25, 1] : [1, 1.05, 1],
                }}
                transition={{
                  repeat: showParticle ? 0 : Infinity,
                  duration: showParticle ? 0.3 : 2,
                  ease: "easeInOut",
                }}
                className="relative cursor-pointer select-none"
                onClick={executeStudyLog}
              >
                {/* Outer light ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500/40 blur-[20px] opacity-40 group-hover/streak:opacity-80 transition-opacity" />
                <div className="relative w-28 h-28 rounded-full border border-orange-500/20 bg-zinc-950 flex flex-col items-center justify-center shadow-lg">
                  <Flame 
                    size={38} 
                    className={`text-orange-500 ${streakDays > 0 ? "fill-orange-500/20" : ""}`} 
                  />
                  <span className="text-3xl font-mono font-bold text-white mt-1">{streakDays}</span>
                  <span className="text-[10px] font-mono tracking-wider text-orange-400">DAYS ACTIVE</span>
                </div>
              </motion.div>
            </Magnetic>
          </div>

          {/* Interactive Button */}
          <Magnetic strength={0.25} range={55}>
            <button
              onClick={executeStudyLog}
              className="relative z-10 w-full py-2.5 px-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500 hover:to-amber-500 hover:text-black font-semibold text-orange-300 hover:shadow-lg hover:shadow-orange-500/20 font-sans text-xs transition-all duration-300 rounded-xl cursor-pointer border border-orange-500/30 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <Zap size={14} className="fill-current" />
              <span>LOG STUDY ACTION</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </GlowCard>
  );
};
