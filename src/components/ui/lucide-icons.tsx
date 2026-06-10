import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = "",
  size = 20,
}) => {
  // Safe dynamic lookup of Lucide Icons
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Elegant fallback icon
    return <Icons.BookOpen className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

export const AvailableIconsList = [
  "Layers",
  "Code",
  "Sparkles",
  "FileCode",
  "Trophy",
  "Settings",
  "Home",
  "GraduationCap",
  "Zap",
  "Terminal",
  "BookOpen",
  "BarChart2",
  "Sparkle",
  "Globe",
  "Cpu",
  "Database"
];
