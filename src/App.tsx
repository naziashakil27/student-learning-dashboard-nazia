import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { dbService } from "./lib/supabase/client";
import { Course, NavTab } from "./lib/types";
import { Sidebar } from "./components/layout/sidebar";
import { MobileNav } from "./components/layout/mobile-nav";
import { BentoGrid } from "./components/dashboard/bento-grid";
import { CoursesView } from "./components/views/courses-view";
import { ProgressView } from "./components/views/progress-view";
import { AchievementsView } from "./components/views/achievements-view";
import { SettingsView } from "./components/views/settings-view";
import { DashboardSkeleton } from "./components/ui/skeleton";
import { AlertCircle, RefreshCw, Sparkles, Terminal } from "lucide-react";
import { AmbientCanvas } from "./components/ui/ambient-canvas";

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  
  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // User States cached in localStorage
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("nova_user_display_name") || "Nazia Shakil";
  });
  
  const [streakDays, setStreakDays] = useState<number>(() => {
    const raw = localStorage.getItem("nova_user_streak_days");
    return raw ? parseInt(raw, 10) : 5;
  });

  // Load courses database data
  const loadDatabase = async (simulateDelay = true) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (simulateDelay) {
        // Intentionally simulate a brief 650ms network delay to exhibit the gorgeous SaaS skeleton shimmers.
        await new Promise((resolve) => setTimeout(resolve, 650));
      }
      const data = await dbService.getCourses();
      setCourses(data);
    } catch (err: any) {
      setErrorMsg(err?.message || "Critical failed to establish synchronized terminal connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-migrate spelling correction for the user from "Nazi Shakil" to "Nazia Shakil"
    const currentCached = localStorage.getItem("nova_user_display_name");
    if (currentCached === "Nazi Shakil") {
      updateUserName("Nazia Shakil");
    }
    loadDatabase(true);
  }, []);

  // Update overall User preferences
  const updateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem("nova_user_display_name", name);
  };

  const updateStreakValue = (days: number) => {
    setStreakDays(days);
    localStorage.setItem("nova_user_streak_days", String(days));
  };

  const handleLogStudyTime = () => {
    const freshStreak = streakDays + 1;
    updateStreakValue(freshStreak);
  };

  // Mutator actions
  const handleUpdateCourseProgress = async (id: string, progress: number) => {
    // Keep UI response immediate (Optimistic UI updates)
    setCourses((prev) => 
      prev.map((c) => (c.id === id ? { ...c, progress } : c))
    );
    try {
      await dbService.updateCourseProgress(id, progress);
    } catch (e) {
      console.error("Failed to commit progress update to cloud:", e);
    }
  };

  const handleAddCourseModule = async (title: string, icon: string, difficulty: "Beginner" | "Intermediate" | "Advanced", description: string) => {
    try {
      const updated = await dbService.addCourse(title, icon, difficulty, description);
      setCourses(updated);
    } catch (e) {
      console.error("Failed to insert module into courses datastore:", e);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const updated = await dbService.deleteCourse(id);
      setCourses(updated);
    } catch (e) {
      console.error("Failed to delete module from courses datastore", e);
    }
  };

  const handleResetAllData = () => {
    localStorage.removeItem("premium_learning_courses");
    updateUserName("Nazia Shakil");
    updateStreakValue(5);
    loadDatabase(true);
  };

  // Render proper View component according to selected tab
  const renderTabContent = () => {
    if (loading) {
      return <DashboardSkeleton />;
    }

    if (errorMsg) {
      return (
        <section 
          className="flex flex-col items-center justify-center min-h-[400px] text-center bg-zinc-950/40 border border-red-500/10 p-8 rounded-[24px]"
          aria-label="Error state screen"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 animate-pulse">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-base font-semibold font-sans text-white">CONNECTION FLUX SYNCHRONIZATION FAILURE</h3>
          <p className="text-xs text-zinc-500 font-sans max-w-sm mt-1 leading-relaxed">
            {errorMsg}
          </p>
          <button
            onClick={() => loadDatabase(true)}
            className="mt-6 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs rounded-xl flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <RefreshCw size={12} className="animate-spin" />
            <span>RE-INITIATE SYNCHRONIZATION</span>
          </button>
        </section>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <BentoGrid
            courses={courses}
            onUpdateProgress={handleUpdateCourseProgress}
            onDeleteCourse={handleDeleteCourse}
            userName={userName}
            onUpdateUserName={updateUserName}
            onLogStudyTime={handleLogStudyTime}
            streakDays={streakDays}
          />
        );
      case "courses":
        return (
          <CoursesView
            courses={courses}
            onAddCourse={handleAddCourseModule}
            onUpdateProgress={handleUpdateCourseProgress}
            onDeleteCourse={handleDeleteCourse}
          />
        );
      case "progress":
        return <ProgressView courses={courses} />;
      case "achievements":
        return <AchievementsView courses={courses} streakDays={streakDays} />;
      case "settings":
        return (
          <SettingsView
            userName={userName}
            onUpdateUserName={updateUserName}
            streakDays={streakDays}
            onUpdateStreak={updateStreakValue}
            onResetAllData={handleResetAllData}
          />
        );
      default:
        return <DashboardSkeleton />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient Canvas with GSAP handles smooth scroll parallax & pointer aura magnetism */}
      <AmbientCanvas />

      {/* Semantic Left Block: Collapsible Sidebar Menu */}
      <Sidebar 
        activeTab={activeTab} 
        onActiveTabChange={(tab) => {
          setActiveTab(tab);
          // Let's trigger a super fast micro-skeleton sync loop on screen swap to feel organic
          setLoading(true);
          setTimeout(() => setLoading(false), 240);
        }} 
        userName={userName} 
      />

      {/* Semantic Right Block: Main grid stage */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-h-screen relative z-10 transition-all duration-300">
        {/* Upper Dashboard Global Action Header */}
        <header className="h-16 border-b border-zinc-900/60 flex items-center justify-between px-6 bg-zinc-950/30 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-zinc-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              NOVA://LEARNING/TERMINAL-NODE.0x20
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Dynamic Cloud status key */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>OFFLINE ENCRYPTED OK</span>
            </div>
          </div>
        </header>

        {/* Dynamic view wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (loading ? "-loading" : "-loaded")}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Dynamic Navigation Bar handles bottom */}
      <MobileNav 
        activeTab={activeTab} 
        onActiveTabChange={(tab) => {
          setActiveTab(tab);
          setLoading(true);
          setTimeout(() => setLoading(false), 180);
        }} 
      />
    </div>
  );
}
