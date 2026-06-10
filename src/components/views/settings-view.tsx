import React, { useState } from "react";
import { GlowCard } from "../ui/glow-card";
import { Settings, RefreshCw, Star, Info, Shield, Check, Copy, AlertTriangle } from "lucide-react";
import { isSupabaseConfigured } from "../../lib/supabase/client";

interface SettingsViewProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  streakDays: number;
  onUpdateStreak: (days: number) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  onUpdateUserName,
  streakDays,
  onUpdateStreak,
  onResetAllData,
}) => {
  const [copied, setCopied] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [showStatus, setShowStatus] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim()) {
      onUpdateUserName(editedName.trim());
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 2000);
    }
  };

  const copySqlToClipboard = () => {
    const sqlSeed = `CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  icon_name TEXT DEFAULT 'Code',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  category TEXT,
  difficulty TEXT
);

INSERT INTO courses (title, progress, icon_name, description, category, difficulty) VALUES
('Advanced React Patterns', 68, 'Layers', 'Master Compound Components, Render Props, State Reducer, and concurrent rendering hooks.', 'Frontend Dev', 'Advanced'),
('TypeScript Mastery', 85, 'Code', 'Deep generics, lookup types, and decorators.', 'Languages', 'Advanced'),
('Framer Motion Fundamentals', 42, 'Sparkles', 'Dynamic physical constants, spring systems, layoutId.', 'Creative Dev', 'Intermediate'),
('System Design Basics', 15, 'FileCode', 'Explore load balancers, database replication, and rate limiters.', 'Architecture', 'Beginner');`;

    navigator.clipboard.writeText(sqlSeed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase">
            <Settings size={12} className="text-zinc-500" />
            <span>Profile and Preferences</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            SaaS Configuration Panel
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Configure system configurations, profile cards, and audit connection variables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile card */}
          <GlowCard className="p-6 bg-zinc-950/40 border border-zinc-900">
            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold font-sans text-white">USER PROFILE CARD</h3>
                  <p className="text-xs text-zinc-500">Configure public display labels</p>
                </div>
                {showStatus && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
                    <Check size={12} />
                    <span>Saved Successful</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Username Display Label</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editedName}
                    maxLength={20}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-semibold text-xs text-white cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </GlowCard>

          {/* Seed restoration panel */}
          <GlowCard className="p-6 bg-zinc-950/40 border border-zinc-900">
            <div className="space-y-4">
              <div className="border-b border-zinc-900 pb-3">
                <h3 className="text-sm font-semibold font-sans text-white">RESET & SYMMETRY RESTORE</h3>
                <p className="text-xs text-zinc-500">Revert caching storages back to initial metrics</p>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                If the database state gets corrupted or you desire to review the initial student learning courses ("Advanced React Patterns", "TypeScript Mastery"), press below to clear cached variables and restore seeded models.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all courses and metrics?")) {
                      onResetAllData();
                    }
                  }}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/20 font-semibold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2"
                >
                  <RefreshCw size={12} />
                  <span>RESTORE FACTORY STATE</span>
                </button>
                
                <div className="space-y-0.5">
                  <div className="text-[10px] text-zinc-500 font-mono">Streak Adjuster:</div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => onUpdateStreak(Math.max(0, streakDays - 1))}
                      className="px-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 text-xs hover:text-white cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono text-zinc-300 w-8 text-center">{streakDays}d</span>
                    <button 
                      onClick={() => onUpdateStreak(streakDays + 1)}
                      className="px-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 text-xs hover:text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Supabase Connection diagnostics guide sidebar */}
        <div className="space-y-6">
          <GlowCard className="p-6 bg-zinc-950/60 border border-zinc-800/80">
            <div className="space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center gap-1.5">
                <Shield size={16} className={supabaseConfigured ? "text-emerald-400" : "text-amber-500"} />
                <h3 className="text-sm font-semibold font-sans text-white">SUPABASE TELEMETRY</h3>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">CONNECTION STATUS:</div>
                {supabaseConfigured ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>CONNECTED TO CLOUD DATABASE</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] font-mono text-amber-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>RUNNING INTUITIVE OFFLINE FALLBACK</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Connect your personal Supabase cluster to run real persistent SQL database storage. Simply copy the SQL statement below to initialize your table, and insert the client keys into the secrets configuration.
              </p>

              {/* Copy SQL table syntax wrapper */}
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="w-full flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl font-mono text-xs text-zinc-300 transition-colors cursor-pointer group"
              >
                <span className="truncate pr-4 flex items-center gap-2">
                  <Star size={12} className="text-indigo-400 shrink-0" />
                  <span className="text-zinc-400 text-[10px]">Copy table SQL DDL</span>
                </span>
                {copied ? (
                  <span className="text-[10px] text-emerald-400 font-bold shrink-0">Copied!</span>
                ) : (
                  <Copy size={12} className="text-zinc-500 group-hover:text-white shrink-0 transition-colors" />
                )}
              </button>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};
