import React, { useState } from "react";
import { GlowCard } from "../ui/glow-card";
import { motion } from "motion/react";
import { Calendar, Info, BarChart2, CheckCircle } from "lucide-react";

interface ActivityTileProps {
  userName: string;
  totalHoursStudied?: number;
}

export const ActivityTile: React.FC<ActivityTileProps> = ({
  userName,
  totalHoursStudied = 42,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; dayLabel: string } | null>(null);

  // Define weeks and days grid values.
  const COLUMNS = 24; // 24 weeks of consistency
  const DAYS = 7; // Sunday to Saturday (7 rows)

  // Generate mock authentic dataset for learning heatmap (0 = none, 1 = light, 2 = moderate, 3 = high, 4 = expert)
  const generateMockGrid = () => {
    const grid: { level: number; date: string; label: string }[][] = [];
    const dateCursor = new Date();
    dateCursor.setDate(dateCursor.getDate() - (COLUMNS * DAYS));

    // Array of mock patterns to make the heatmaps look realistic
    const randomWeights = [0, 0, 1, 1, 0, 2, 0, 3, 4, 1, 0, 2, 1, 0, 0, 3, 2, 4, 1, 0, 2, 0, 1, 3, 2, 2, 1];

    for (let col = 0; col < COLUMNS; col++) {
      const weekColumn: { level: number; date: string; label: string }[] = [];
      for (let d = 0; d < DAYS; d++) {
        const index = (col * DAYS + d) % randomWeights.length;
        const levelResponse = randomWeights[index];
        
        // Generate formatted date label
        const dateString = dateCursor.toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          year: "numeric" 
        });

        // Some logical spikes on weekend or mid-week
        const isSpike = (col % 4 === 0 && d === 2) || (col % 6 === 0 && d === 4);
        const actualLevel = isSpike ? Math.min(4, levelResponse + 1) : levelResponse;

        weekColumn.push({
          level: actualLevel,
          date: dateCursor.toISOString().split("T")[0],
          label: dateString,
        });

        // Advance date cursor
        dateCursor.setDate(dateCursor.getDate() + 1);
      }
      grid.push(weekColumn);
    }
    return grid;
  };

  const activityGrid = generateMockGrid();

  // Get active cell color matching level
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-zinc-900 border border-zinc-800/40 hover:bg-zinc-800/50";
      case 1: return "bg-indigo-950/40 border border-indigo-900/40 hover:bg-indigo-900/60";
      case 2: return "bg-indigo-900/60 border border-indigo-800/50 hover:bg-indigo-800/80";
      case 3: return "bg-indigo-600 border border-indigo-500/80 hover:bg-indigo-500";
      case 4: return "bg-emerald-500 hover:bg-emerald-400 border border-emerald-400";
      default: return "bg-zinc-900 border border-zinc-800/40";
    }
  };

  // Convert level value to a status string
  const getLevelExplanation = (level: number) => {
    switch (level) {
      case 0: return "No modules updated";
      case 1: return "1 brief study session (15m)";
      case 2: return "Moderate mastery update (45m)";
      case 3: return "High-intensity system drills (2h+)";
      case 4: return "Ultra Master Drill Completed (4h+)";
      default: return "";
    }
  };

  return (
    <GlowCard className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-zinc-950/60 border border-zinc-800/80">
      <div className="flex flex-col space-y-6 h-full">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-sans font-medium text-white flex items-center gap-2">
              <Calendar size={18} className="text-zinc-400" />
              <span>GITHUB-STYLE CURRICULUM HEATMAP</span>
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Daily lecture cycles, git commits, and curriculum study synchronization blocks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              Consistency Index: <strong className="text-indigo-400 font-bold">89.4%</strong>
            </span>
          </div>
        </div>

        {/* Heatmap Layout Frame */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="min-w-[640px] flex gap-3 select-none">
            {/* Row Day Labels */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-zinc-600 py-1 pr-1.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>

            {/* Grid Cells Columns mapping */}
            <div className="flex-1 grid grid-cols-24 gap-1.5">
              {activityGrid.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-1.5">
                  {week.map((day, dIndex) => (
                    <motion.div
                      key={day.date}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: (wIndex * 7 + dIndex) * 0.002,
                      }}
                      onMouseEnter={() => setHoveredDay({ 
                        date: day.label, 
                        count: day.level,
                        dayLabel: getLevelExplanation(day.level) 
                      })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`h-3 w-3 rounded-sm transition-all duration-200 cursor-pointer ${getLevelColor(day.level)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info/tooltip block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-zinc-900 text-xs">
          {/* Legend indicator key */}
          <div className="flex items-center gap-2 bg-zinc-900/30 px-3 py-1.5 rounded-lg border border-zinc-900/80">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">LEGEND:</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 font-sans">Less</span>
              <span className="h-2.5 w-2.5 rounded-sm bg-zinc-900 border border-zinc-800" />
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-950 border border-indigo-900/50" />
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-900/60 border border-indigo-800/50" />
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-600" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              <span className="text-[10px] text-zinc-500 font-sans">More</span>
            </div>
          </div>

          {/* Interactive contextual display with fade entry */}
          <div className="min-h-[28px] flex items-center">
            {hoveredDay ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-zinc-300 font-mono text-[11px] bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-md"
              >
                <span className="text-indigo-400 font-bold">{hoveredDay.date}:</span>
                <span>{hoveredDay.dayLabel}</span>
              </motion.div>
            ) : (
              <span className="text-zinc-600 flex items-center gap-1.5 text-[11px]">
                <Info size={12} className="text-zinc-500" />
                <span>Hover over grid cubes to audit historical learning indexes</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
};
