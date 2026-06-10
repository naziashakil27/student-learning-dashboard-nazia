import React from "react";
import { motion } from "motion/react";
import { Course } from "../../lib/types";
import { HeroTile } from "./hero-tile";
import { CourseCard } from "./course-card";
import { ActivityTile } from "./activity-tile";

interface BentoGridProps {
  courses: Course[];
  onUpdateProgress: (id: string, progress: number) => void;
  onDeleteCourse: (id: string) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  onLogStudyTime: () => void;
  streakDays: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  courses,
  onUpdateProgress,
  onDeleteCourse,
  userName,
  onUpdateUserName,
  onLogStudyTime,
  streakDays,
}) => {
  // Framer Motion staggered entrance animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1 pb-16"
    >
      {/* 1. Hero Tile - Spans full 4 cols on desktop */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 select-none">
        <HeroTile
          courses={courses}
          userName={userName}
          onUpdateUserName={onUpdateUserName}
          onLogStudyTime={onLogStudyTime}
          streakDays={streakDays}
        />
      </motion.div>

      {/* 2. Dynamic Course Tiles */}
      {courses.map((course, index) => (
        <motion.div key={course.id} variants={itemVariants}>
          <CourseCard
            course={course}
            onUpdateProgress={onUpdateProgress}
            onDelete={onDeleteCourse}
            index={index}
          />
        </motion.div>
      ))}

      {/* 3. Activity Heatmap Tile - Spans full 4 cols on desktop */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4">
        <ActivityTile
          userName={userName}
          totalHoursStudied={courses.reduce((sum, c) => sum + Math.round(c.progress * 0.45), 20)}
        />
      </motion.div>
    </motion.div>
  );
};
