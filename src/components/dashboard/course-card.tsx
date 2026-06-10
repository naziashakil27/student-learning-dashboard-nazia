import React, { useState } from "react";
import { Course } from "../../lib/types";
import { GlowCard } from "../ui/glow-card";
import { DynamicIcon } from "../ui/lucide-icons";
import { AnimatedProgress } from "./animated-progress";
import { CheckCircle, RefreshCw, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface CourseCardProps {
  course: Course;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete?: (id: string) => void;
  index: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onUpdateProgress,
  onDelete,
  index,
}) => {
  const [showControls, setShowControls] = useState(false);

  // Pick unique mesh gradients for different courses
  const meshColors = [
    "from-purple-500/10 via-transparent to-pink-500/5",
    "from-indigo-500/10 via-transparent to-emerald-500/5",
    "from-emerald-500/10 via-transparent to-teal-500/5",
    "from-blue-500/10 via-transparent to-violet-500/5",
  ];
  
  const progressColors = [
    "from-purple-500 to-pink-400",
    "from-indigo-500 to-emerald-400",
    "from-emerald-500 to-teal-400",
    "from-cyan-500 to-blue-400",
  ];

  const meshGradient = meshColors[index % meshColors.length];
  const progressColor = progressColors[index % progressColors.length];

  const handleAddProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextProgress = Math.min(100, course.progress + 10);
    onUpdateProgress(course.id, nextProgress);
  };

  const handleResetProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress(course.id, 0);
  };

  const handleCompleteProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProgress(course.id, 100);
  };

  return (
    <GlowCard 
      onClick={() => setShowControls(!showControls)}
      className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between min-h-[200px] border border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/40 relative group cursor-pointer"
    >
      {/* Mesh gradient background overlay strictly scoped to this card */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${meshGradient} opacity-60 pointer-events-none`} />

      <div className="space-y-4">
        {/* Header Block */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            {/* Soft Glowing Emblem container */}
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-white relative shadow-sm">
              <div className="absolute inset-0.5 rounded-lg bg-gradient-to-tr from-zinc-900 to-zinc-800/50" />
              <div className="relative z-10 flex items-center justify-center">
                <DynamicIcon name={course.icon_name} className="text-zinc-300" size={18} />
              </div>
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase bg-zinc-900/50 px-2 py-0.5 rounded-full border border-zinc-800/60">
                  {course.category}
                </span>
                <span className={`text-[9px] font-mono tracking-wide px-1.5 rounded-full uppercase border ${
                  course.difficulty === "Advanced" 
                    ? "text-red-400 bg-red-400/5 border-red-500/10" 
                    : course.difficulty === "Intermediate"
                    ? "text-yellow-400 bg-yellow-400/5 border-yellow-500/10"
                    : "text-emerald-400 bg-emerald-400/5 border-emerald-500/10"
                }`}>
                  {course.difficulty}
                </span>
              </div>
              <h3 className="text-sm font-sans font-semibold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                {course.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {course.progress === 100 ? (
              <CheckCircle size={16} className="text-emerald-400 fill-emerald-400/10" />
            ) : (
              <div className="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors flex items-center">
                <span>Active</span>
                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 text-zinc-400" />
              </div>
            )}
          </div>
        </div>

        {/* Short text description */}
        <p className="text-zinc-400 text-xs font-sans line-clamp-2 leading-relaxed">
          {course.description || "Fully unified curriculum covering key functional aspects, patterns, architecture, and advanced concepts."}
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 pt-4">
        <AnimatedProgress 
          value={course.progress} 
          colorClassName={progressColor} 
          delay={index * 0.15} 
        />

        {/* Extra Interactive Floating Action Handles on Expand */}
        <div className={`overflow-hidden transition-all duration-300 ${showControls ? "max-h-12 opacity-100 pointer-events-auto mt-2" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-900/40">
            <div className="flex gap-1.5">
              <button
                onClick={handleAddProgress}
                className="px-2 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-0.5"
                title="Add 10% progress"
              >
                <Plus size={10} />
                <span>+10%</span>
              </button>
              <button
                onClick={handleCompleteProgress}
                className="px-2 py-1 text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/25 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-500/25 transition-all cursor-pointer"
                title="Mark as completed"
              >
                Complete
              </button>
              <button
                onClick={handleResetProgress}
                className="px-1.5 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
                title="Reset progress"
              >
                <RefreshCw size={10} />
              </button>
            </div>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course.id);
                }}
                className="p-1 px-1.5 text-zinc-500 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-500/10 rounded-md transition-all cursor-pointer"
                title="Delete course"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
};
