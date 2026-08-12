/**
 * Gamification Engine
 * Manages XP, reputation, badges, levels, and leaderboards
 * Rewards civic participation and accurate reporting
 */

import type { GamificationProfile, Badge, LeaderboardEntry } from "./types";

/** XP rewards for different actions */
const XP_REWARDS = {
  issueReported: 10,
  issueVerified: 25,
  correctReport: 50, // Issue led to resolution
  streakBonus: 5, // Per consecutive day
  badgeEarned: 15,
};

/** Reputation multipliers */
const REPUTATION_MULTIPLIERS = {
  issueReported: 1,
  issueVerified: 3,
  correctReport: 5,
  badgeEarned: 2,
};

/** XP thresholds for levels */
const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250,
];

/** Badge definitions */
export const BADGE_DEFINITIONS: Record<string, Omit<Badge, "awardedAt">> = {
  first_report: {
    id: "first_report",
    name: "First Step",
    description: "Reported your first issue",
    icon: "🎯",
    criteria: "issues_reported",
  },
  issue_reporter_5: {
    id: "issue_reporter_5",
    name: "Active Reporter",
    description: "Reported 5 issues",
    icon: "📝",
    criteria: "issues_reported",
  },
  issue_reporter_25: {
    id: "issue_reporter_25",
    name: "Prolific Reporter",
    description: "Reported 25 issues",
    icon: "🌟",
    criteria: "issues_reported",
  },
  verified_citizen: {
    id: "verified_citizen",
    name: "Verified",
    description: "Had an issue verified and resolved",
    icon: "✅",
    criteria: "issues_verified",
  },
  accuracy_100: {
    id: "accuracy_100",
    name: "Precision",
    description: "100% of reported issues verified",
    icon: "🎯",
    criteria: "accuracy",
  },
  streak_7: {
    id: "streak_7",
    name: "Dedicated",
    description: "Reported issues 7 days in a row",
    icon: "🔥",
    criteria: "streak",
  },
  streak_30: {
    id: "streak_30",
    name: "Unstoppable",
    description: "Reported issues 30 days in a row",
    icon: "💪",
    criteria: "streak",
  },
};

/** Gamification Engine */
class GamificationEngine {
  /**
   * Create initial gamification profile for a citizen
   */
  createProfile(citizenId: string): GamificationProfile {
    return {
      citizenId,
      reputation: 0,
      xp: 0,
      level: 0,
      badges: [],
      issuesReported: 0,
      issuesVerified: 0,
      correctReports: 0,
      streakDays: 0,
      leaderboardRank: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /**
   * Award XP for an action
   */
  awardXP(
    profile: GamificationProfile,
    action: keyof typeof XP_REWARDS,
    amount?: number
  ): GamificationProfile {
    const baseXP = XP_REWARDS[action];
    const xpGain = amount || baseXP;
    const oldLevel = profile.level;

    const updated = {
      ...profile,
      xp: profile.xp + xpGain,
      updatedAt: Date.now(),
    };

    // Calculate new level
    updated.level = this.calculateLevel(updated.xp);

    // Check if leveled up
    if (updated.level > oldLevel) {
      // Can trigger level-up notifications here
    }

    return updated;
  }

  /**
   * Award reputation
   */
  awardReputation(
    profile: GamificationProfile,
    action: keyof typeof REPUTATION_MULTIPLIERS,
    amount?: number
  ): GamificationProfile {
    const baseReputation = REPUTATION_MULTIPLIERS[action];
    const reputationGain = amount || baseReputation;

    return {
      ...profile,
      reputation: profile.reputation + reputationGain,
      updatedAt: Date.now(),
    };
  }

  /**
   * Award badge to citizen
   */
  awardBadge(profile: GamificationProfile, badgeId: string): GamificationProfile {
    const badgeDef = BADGE_DEFINITIONS[badgeId];
    if (!badgeDef) return profile; // Badge doesn't exist

    // Check if already has badge
    if (profile.badges.some((b) => b.id === badgeId)) {
      return profile; // Already has badge
    }

    const badge: Badge = {
      ...badgeDef,
      awardedAt: Date.now(),
    };

    return {
      ...profile,
      badges: [...profile.badges, badge],
      updatedAt: Date.now(),
    };
  }

  /**
   * Record issue reported
   */
  recordIssueReported(profile: GamificationProfile): GamificationProfile {
    let updated = {
      ...profile,
      issuesReported: profile.issuesReported + 1,
    };

    // Award XP and reputation
    updated = this.awardXP(updated, "issueReported");
    updated = this.awardReputation(updated, "issueReported");

    // Check for badges
    if (updated.issuesReported === 1) {
      updated = this.awardBadge(updated, "first_report");
    } else if (updated.issuesReported === 5) {
      updated = this.awardBadge(updated, "issue_reporter_5");
    } else if (updated.issuesReported === 25) {
      updated = this.awardBadge(updated, "issue_reporter_25");
    }

    return updated;
  }

  /**
   * Record issue verified and resolved
   */
  recordIssueVerified(profile: GamificationProfile, isCorrect: boolean = true): GamificationProfile {
    let updated = {
      ...profile,
      issuesVerified: profile.issuesVerified + 1,
      correctReports: isCorrect ? profile.correctReports + 1 : profile.correctReports,
    };

    // Award XP and reputation
    updated = this.awardXP(updated, "issueVerified");
    updated = this.awardReputation(updated, "issueVerified");

    // Extra reward for correct report
    if (isCorrect) {
      updated = this.awardXP(updated, "correctReport");
      updated = this.awardReputation(updated, "correctReport");
    }

    // Check for badges
    if (updated.issuesVerified === 1) {
      updated = this.awardBadge(updated, "verified_citizen");
    }

    // Check accuracy badge
    if (updated.issuesVerified > 0) {
      const accuracy = updated.correctReports / updated.issuesVerified;
      if (accuracy === 1 && updated.issuesVerified >= 5) {
        updated = this.awardBadge(updated, "accuracy_100");
      }
    }

    return updated;
  }

  /**
   * Update streak based on reporting activity
   * Should be called daily or per report
   */
  updateStreak(profile: GamificationProfile, isActive: boolean): GamificationProfile {
    if (!isActive) {
      return { ...profile, streakDays: 0 };
    }

    const newStreak = profile.streakDays + 1;
    let updated = {
      ...profile,
      streakDays: newStreak,
    };

    // Award streak bonus XP
    updated = this.awardXP(updated, "streakBonus", 5 * newStreak);

    // Check for streak badges
    if (newStreak === 7) {
      updated = this.awardBadge(updated, "streak_7");
    } else if (newStreak === 30) {
      updated = this.awardBadge(updated, "streak_30");
    }

    return updated;
  }

  /**
   * Calculate level from XP
   */
  private calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Get XP needed for next level
   */
  getXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= LEVEL_THRESHOLDS.length - 1) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    }
    return LEVEL_THRESHOLDS[currentLevel + 1];
  }

  /**
   * Calculate global leaderboard position
   */
  calculateLeaderboardRank(
    profiles: GamificationProfile[],
    citizenId: string
  ): LeaderboardEntry | null {
    // Sort by reputation, then XP, then issuesVerified
    const sorted = [...profiles].sort((a, b) => {
      if (b.reputation !== a.reputation) {
        return b.reputation - a.reputation;
      }
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return b.issuesVerified - a.issuesVerified;
    });

    const index = sorted.findIndex((p) => p.citizenId === citizenId);
    if (index === -1) return null;

    const profile = sorted[index];
    return {
      rank: index + 1,
      citizenId: profile.citizenId,
      reputation: profile.reputation,
      xp: profile.xp,
      level: profile.level,
      issuesReported: profile.issuesReported,
      correctReports: profile.correctReports,
    };
  }

  /**
   * Get top leaderboard entries
   */
  getLeaderboard(profiles: GamificationProfile[], limit: number = 10): LeaderboardEntry[] {
    const sorted = [...profiles].sort((a, b) => {
      if (b.reputation !== a.reputation) {
        return b.reputation - a.reputation;
      }
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return b.issuesVerified - a.issuesVerified;
    });

    return sorted.slice(0, limit).map((profile, index) => ({
      rank: index + 1,
      citizenId: profile.citizenId,
      reputation: profile.reputation,
      xp: profile.xp,
      level: profile.level,
      issuesReported: profile.issuesReported,
      correctReports: profile.correctReports,
    }));
  }
}

// Export singleton instance
export const gamificationEngine = new GamificationEngine();

export default GamificationEngine;
