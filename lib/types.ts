/**
 * Shared types and interfaces for CivicGrid AI
 * Used across citizen, admin, worker, and gamification modules
 */

/** Issue severity levels */
export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

/** Issue categories for classification */
export type IssueCategory =
  | "Pothole"
  | "Garbage"
  | "Blocked Drain"
  | "Water Leak"
  | "Flooding"
  | "Damaged Road"
  | "Broken Streetlight"
  | "Other";

/** Department routing */
export type Department =
  | "Roads"
  | "Sanitation"
  | "Water"
  | "Electricity"
  | "Parks"
  | "Other";

/** Issue status lifecycle */
export type IssueStatus =
  | "Reported"
  | "Classified"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Verified"
  | "Closed";

/** AI classification result */
export interface AIClassificationResult {
  category: IssueCategory;
  severity: SeverityLevel;
  confidence: number; // 0-1
  department: Department;
  reason: string;
  timestamp?: number;
}

/** Issue evidence (photos, attachments) */
export interface Evidence {
  id: string;
  type: "image" | "video" | "text";
  url: string;
  caption?: string;
  uploadedAt: number;
}

/** Core Issue entity */
export interface Issue {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: IssueStatus;
  category?: IssueCategory;
  severity?: SeverityLevel;
  evidence: Evidence[];
  classification?: AIClassificationResult;
  duplicateOf?: string; // ID of the original issue if this is a duplicate
  nearbyIssues?: string[]; // IDs of nearby issues
  assignedTo?: string; // Worker ID
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
}

/** Gamification profile for citizen */
export interface GamificationProfile {
  citizenId: string;
  reputation: number; // Overall reputation score
  xp: number; // Experience points
  level: number; // Calculated from XP
  badges: Badge[];
  issuesReported: number;
  issuesVerified: number;
  correctReports: number; // Reports that led to resolution
  streakDays: number; // Consecutive days reporting
  leaderboardRank: number;
  createdAt: number;
  updatedAt: number;
}

/** Gamification Badge */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awardedAt: number;
  criteria: "issues_reported" | "issues_verified" | "streak" | "accuracy" | "special";
}

/** Worker profile */
export interface Worker {
  id: string;
  name: string;
  email: string;
  department: Department;
  status: "available" | "busy" | "offline";
  assignedIssues: string[]; // Issue IDs
  resolvedCount: number;
  avgResolutionTime: number; // in hours
  createdAt: number;
  updatedAt: number;
}

/** Admin user profile */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  department?: Department;
  permissions: string[];
  createdAt: number;
  updatedAt: number;
}

/** Duplicate detection result */
export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  confidence: number; // 0-1
  matchedIssueId?: string;
  similarity: number; // 0-1, how similar the issues are
  reason: string;
}

/** Leaderboard entry */
export interface LeaderboardEntry {
  rank: number;
  citizenId: string;
  citizenName?: string;
  reputation: number;
  xp: number;
  level: number;
  issuesReported: number;
  correctReports: number;
}
