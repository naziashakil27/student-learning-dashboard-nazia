export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export type NavTab = "dashboard" | "courses" | "progress" | "achievements" | "settings";

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number; // For learning count/level (0 to 4)
  label?: string;
}

export interface UserStats {
  name: string;
  streakDays: number;
  totalHours: number;
  completedCourses: number;
  overallProgress: number;
}
