"use client";

/**
 * Gamification Leaderboard Component
 * Displays citizen reputation, XP, badges, and leaderboard rankings
 */

import React from "react";
import type { GamificationProfile, LeaderboardEntry } from "@/lib/types";
import { demoWorkflowService } from "@/lib/services";

interface GamificationLeaderboardProps {
  currentUserId?: string;
  limit?: number;
}

export function GamificationLeaderboard({
  currentUserId = "CIT-100",
  limit = 10,
}: GamificationLeaderboardProps) {
  const profiles = demoWorkflowService.getProfiles();
  const leaderboard: LeaderboardEntry[] = [...profiles]
    .sort((a, b) => {
      if (b.reputation !== a.reputation) return b.reputation - a.reputation;
      return b.xp - a.xp;
    })
    .slice(0, limit)
    .map((p, i) => ({
      rank: i + 1,
      citizenId: p.citizenId,
      reputation: p.reputation,
      xp: p.xp,
      level: p.level,
      issuesReported: p.issuesReported,
      correctReports: p.correctReports,
    }));
  const userProfile: GamificationProfile | null = profiles.find((p) => p.citizenId === currentUserId) ?? null;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Loading gamification data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      {userProfile && (
        <div className="rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200 dark:border-sky-700 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Your Profile
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {userProfile.citizenId}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Level</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                  {userProfile.level}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">XP</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                  {userProfile.xp}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Reputation
                </p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                  {userProfile.reputation}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Badges</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                  {userProfile.badges.length}
                </p>
              </div>
            </div>

            {userProfile.badges.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Badges Earned
                </p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-sm"
                      title={badge.description}
                    >
                      <span>{badge.icon}</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Issues Reported
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {userProfile.issuesReported}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Verified
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {userProfile.issuesVerified}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Streak
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {userProfile.streakDays}d
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Leaderboard</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Top {limit} citizens by reputation and activity
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Citizen
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  XP
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Reputation
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Reports
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.citizenId}
                  onClick={() => {
                    // Could expand to show more details
                  }}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                    entry.citizenId === currentUserId
                      ? "bg-sky-50 dark:bg-sky-900/20"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          entry.rank === 1
                            ? "bg-yellow-500"
                            : entry.rank === 2
                              ? "bg-gray-400"
                              : entry.rank === 3
                                ? "bg-orange-600"
                                : "bg-slate-400"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {entry.citizenId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                      {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {entry.xp}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {entry.reputation}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {entry.issuesReported}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GamificationLeaderboard;
