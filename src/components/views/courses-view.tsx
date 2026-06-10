import React, { useState } from "react";
import { Course } from "../../lib/types";
import { CourseCard } from "../dashboard/course-card";
import { Plus, Search, Filter, Sparkles, BookOpen, Layers, Code, FileCode, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AvailableIconsList } from "../ui/lucide-icons";
import { Magnetic } from "../ui/magnetic";

interface CoursesViewProps {
  courses: Course[];
  onAddCourse: (title: string, icon: string, difficulty: "Beginner" | "Intermediate" | "Advanced", description: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onDeleteCourse: (id: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onAddCourse,
  onUpdateProgress,
  onDeleteCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [newIcon, setNewIcon] = useState("Code");

  // Filtering logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === "All" || course.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddCourse(
        newTitle.trim(),
        newIcon,
        newDifficulty,
        newDesc.trim() || "Dynamic learning track with custom simulated database connection."
      );
      // Reset
      setNewTitle("");
      setNewDesc("");
      setNewDifficulty("Beginner");
      setNewIcon("Code");
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase">
            <BookOpen size={12} className="text-zinc-500" />
            <span>Curriculum Core</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Syllabus Masteries
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Register and configure software design patterns, concurrent logic courses, and system architecture.
          </p>
        </div>

        <Magnetic strength={0.25} range={50}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <Plus size={14} />
            <span>PROVISION COURSE</span>
          </button>
        </Magnetic>
      </div>

      {/* Add New Course Dialog form drawer */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="overflow-hidden mb-6"
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-zinc-950/60 border border-indigo-500/10 hover:border-indigo-500/20 p-6 rounded-[24px] space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Sparkles size={16} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white font-sans">NEW CURRICULUM DEFINITION</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rust Concurrency Deepdrive"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Provide curriculum core focus objectives, technologies taught, and architectural outcomes."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                {/* Glyphs list selection */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Select Graphic Glyph icon</span>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/30 rounded-xl border border-zinc-850">
                    {AvailableIconsList.slice(0, 10).map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewIcon(icon)}
                        className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                          newIcon === icon
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                            : "bg-zinc-900 border-zinc-800/80 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all text-xs cursor-pointer focus:outline-none"
                >
                  ADD COURSE MODULE
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar control controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-950/20 border border-zinc-900/80 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Filter modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/60 pin-search border border-zinc-800 focus:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none transition-colors"
          />
        </div>

        {/* Filter Pill tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-[10px] font-mono text-zinc-500 mr-2 flex items-center gap-1 shrink-0">
            <Sliders size={12} />
            <span>DIFFICULTY:</span>
          </span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((tab) => (
            <button
              key={tab}
              onClick={() => setDifficultyFilter(tab)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all border cursor-pointer shrink-0 ${
                difficultyFilter === tab
                  ? "bg-zinc-900 border-zinc-700 text-white font-bold"
                  : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of actual matches */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((c, i) => (
            <CourseCard
              key={c.id}
              course={c}
              onUpdateProgress={onUpdateProgress}
              onDelete={onDeleteCourse}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-[24px]">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 animate-bounce">
            <BookOpen size={20} />
          </div>
          <h4 className="text-sm font-semibold font-sans text-zinc-300">No Custom Modules Found</h4>
          <p className="text-xs text-zinc-500 font-sans max-w-sm mt-1 leading-relaxed">
            There are no courses matching "{searchTerm}" or your difficulty tab filters. Press the Provision button above to inject fresh courses!
          </p>
        </div>
      )}
    </div>
  );
};
