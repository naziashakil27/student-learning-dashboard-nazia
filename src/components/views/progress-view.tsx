import React from "react";
import { Course } from "../../lib/types";
import { GlowCard } from "../ui/glow-card";
import { BarChart2, TrendingUp, Award, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface ProgressViewProps {
  courses: Course[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ courses }) => {
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const overallProgressSum = totalCourses > 0 
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
    : 0;

  // Render a beautiful analytical breakdown
  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase">
            <BarChart2 size={12} className="text-zinc-500" />
            <span>Telemetry & Insights</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Metrics & Insights
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Realtime audit log of curriculum completed rates, average study velocity, and system-wide stats.
          </p>
        </div>
      </div>

      {/* Grid statistics elements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlowCard className="p-6 bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">SYLLABUS RATIO</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-mono font-bold text-white">{overallProgressSum}%</span>
            <div className="text-xs text-zinc-500 mt-1 font-sans">Average course completion score</div>
          </div>
        </GlowCard>

        <GlowCard className="p-6 bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">GRADUATED CERTIFICATION</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-mono font-bold text-emerald-400">{completedCourses}</span>
            <div className="text-xs text-zinc-500 mt-1 font-sans">Modules certified with 100% progress</div>
          </div>
        </GlowCard>

        <GlowCard className="p-6 bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">ESTIMATED STUDY LOAD</span>
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Clock size={16} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-mono font-bold text-zinc-100">
              {courses.reduce((sum, c) => sum + Math.round(c.progress * 0.4), 12)} Hours
            </span>
            <div className="text-xs text-zinc-500 mt-1 font-sans">Accumulated session logs to-date</div>
          </div>
        </GlowCard>
      </div>

      {/* Visual lists breakdown card */}
      <GlowCard className="p-8 bg-zinc-950/60 border border-zinc-800/80">
        <div className="space-y-6">
          <div className="border-b border-zinc-900 pb-3">
            <h3 className="text-sm font-semibold font-sans text-white">DETAILED INDIVIDUAL METEMPSYCHOSIS STATUS</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Realtime analytical layout of active courses</p>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl gap-4 hover:border-zinc-800 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-white font-sans">{course.title}</h4>
                  <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                    <span>Category: {course.category}</span>
                    <span>•</span>
                    <span>Difficulty: {course.difficulty}</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="flex items-center gap-4 w-full sm:w-64">
                  <div className="flex-1 bg-zinc-950 h-2 rounded-full border border-zinc-900/80 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-white min-w-[32px] text-right">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlowCard>
    </div>
  );
};
