import { createClient } from "@supabase/supabase-js";
import { Course } from "../types";

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// We export a helper to check if Supabase is actually configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "";
};

// Initialize the real reader if env is present
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Standard Seed Data for Student Learning courses
const INITIAL_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Advanced React Patterns",
    progress: 68,
    icon_name: "Layers",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Master Compound Components, Render Props, State Reducer, and concurrent rendering hooks.",
    category: "Frontend Dev",
    difficulty: "Advanced",
  },
  {
    id: "course-2",
    title: "TypeScript Mastery",
    progress: 85,
    icon_name: "Code",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Dive deep into utility types, advanced generics, conditional types, and typescript compiler API.",
    category: "Languages",
    difficulty: "Advanced",
  },
  {
    id: "course-3",
    title: "Framer Motion Fundamentals",
    progress: 42,
    icon_name: "Sparkles",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Unlock high-performance, studio-grade layout morphing, orchestration, constraints, and web physics.",
    category: "Creative Dev",
    difficulty: "Intermediate",
  },
  {
    id: "course-4",
    title: "System Design Basics",
    progress: 15,
    icon_name: "FileCode",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Explore load balancers, caching strategies, rate limiters, database replication, and system scaling.",
    category: "Architecture",
    difficulty: "Beginner",
  },
];

// LocalStorage key for mock courses database
const LOCAL_STORAGE_COURSES_KEY = "premium_learning_courses";

/**
 * Robust database controller that coordinates between Supabase and standard offline persistence.
 */
export const dbService = {
  async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data as Course[];
        }
        
        // If Supabase table is empty, seed it
        await this.seedSupabase(INITIAL_COURSES);
        return INITIAL_COURSES;
      } catch (err) {
        console.warn("Supabase fetching failed, turning back to mock data:", err);
        return this.getMockCourses();
      }
    } else {
      return this.getMockCourses();
    }
  },

  getMockCourses(): Course[] {
    const cached = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached courses", e);
      }
    }
    // Set seed data if missing
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  },

  async updateCourseProgress(id: string, progress: number): Promise<Course[]> {
    const roundedProgress = Math.min(100, Math.max(0, progress));
    
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ progress: roundedProgress })
          .eq("id", id);
          
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase update failed, updating local database state instead:", err);
      }
    }
    
    // Always fall back to local update to guarantee working state immediately in sandbox
    const courses = this.getMockCourses();
    const updated = courses.map(c => c.id === id ? { ...c, progress: roundedProgress } : c);
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
    return updated;
  },

  async addCourse(title: string, icon_name: string, difficulty: "Beginner" | "Intermediate" | "Advanced" = "Beginner", description: string = ""): Promise<Course[]> {
    const newCourse: Course = {
      id: "course-" + Date.now(),
      title,
      progress: 0,
      icon_name,
      created_at: new Date().toISOString(),
      description,
      category: "Elective",
      difficulty,
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from("courses")
          .insert([newCourse]);
        if (error) throw error;
      } catch (e) {
        console.warn("Supabase insert failed, inserting mockup instead:", e);
      }
    }

    const courses = this.getMockCourses();
    const updated = [...courses, newCourse];
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
    return updated;
  },

  async deleteCourse(id: string): Promise<Course[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from("courses")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (e) {
        console.warn("Supabase delete failed, deleting mockup instead:", e);
      }
    }

    const courses = this.getMockCourses();
    const updated = courses.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
    return updated;
  },

  async seedSupabase(seedData: Course[]) {
    if (supabase) {
      try {
        await supabase.from("courses").insert(seedData);
      } catch (e) {
        console.error("Could not seed data directly into Supabase:", e);
      }
    }
  }
};
