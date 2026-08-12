"use client";

import GamificationLeaderboard from "@/app/components/GamificationLeaderboard";

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Gamification & Leaderboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View your profile, earned badges, and compete on the leaderboard
          </p>
        </div>

        {/* Leaderboard Component */}
        <GamificationLeaderboard currentUserId="CIT-100" limit={15} />
      </div>
    </div>
  );
}
