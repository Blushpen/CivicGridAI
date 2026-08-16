/**
 * Shared demo workflow service for the CivicGrid MVP.
 *
 * This keeps the existing Design intact while offering a clean in-memory
 * data layer that the admin dashboard, worker dashboard, and leaderboard
 * can use without introducing a duplicate backend or database model.
 */

import { aiClassificationService } from "./aiClassifier";
import { duplicateDetector } from "./duplicateDetector";
import { gamificationEngine } from "./gamificationEngine";
import type {
  GamificationProfile,
  Issue,
  IssueStatus,
  Worker,
  LeaderboardEntry,
} from "../types";

const ISSUE_SEED: Issue[] = [
  {
    id: "ISS-1001",
    citizenId: "CIT-100",
    title: "Pothole on Main Street",
    description: "Large hole in the road near the bus stop has become a traffic hazard.",
    location: { latitude: 40.7128, longitude: -74.006, address: "Main Street & 5th Ave" },
    status: "Assigned",
    category: "Pothole",
    severity: "High",
    evidence: [],
    assignedTo: "WRK-201",
    classification: {
      category: "Pothole",
      severity: "High",
      confidence: 0.91,
      department: "Roads",
      reason: "Road-surface damage detected in the report.",
      timestamp: Date.now(),
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "ISS-1002",
    citizenId: "CIT-101",
    title: "Garbage accumulation near park",
    description: "Overflowing garbage bins have not been collected and are spreading across the sidewalk.",
    location: { latitude: 40.715, longitude: -74.009, address: "Oak Park Entrance" },
    status: "Reported",
    category: "Garbage",
    severity: "Medium",
    evidence: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 13,
    updatedAt: Date.now() - 1000 * 60 * 60 * 10,
  },
  {
    id: "ISS-1003",
    citizenId: "CIT-102",
    title: "Water leaking from pipe",
    description: "A burst pipe is leaking onto the street and creating a puddle.",
    location: { latitude: 40.7183, longitude: -74.0036, address: "Edison Blvd" },
    status: "In Progress",
    category: "Water Leak",
    severity: "High",
    evidence: [],
    assignedTo: "WRK-202",
    classification: {
      category: "Water Leak",
      severity: "High",
      confidence: 0.87,
      department: "Water",
      reason: "Leak indicators detected in the description and location data.",
      timestamp: Date.now(),
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: "ISS-1004",
    citizenId: "CIT-103",
    title: "Streetlight not working",
    description: "The corner streetlight has been dark for several nights and is creating a safety issue.",
    location: { latitude: 40.7099, longitude: -74.0046, address: "Cedar & 11th" },
    status: "Classified",
    category: "Broken Streetlight",
    severity: "Medium",
    evidence: [],
    classification: {
      category: "Broken Streetlight",
      severity: "Medium",
      confidence: 0.86,
      department: "Electricity",
      reason: "Lighting issue indicates a damaged fixture or outage.",
      timestamp: Date.now(),
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "ISS-1005",
    citizenId: "CIT-104",
    title: "Flooded intersection",
    description: "Stormwater has pooled across the intersection and is impeding traffic.",
    location: { latitude: 40.7066, longitude: -74.013, address: "Hudson & 4th" },
    status: "Assigned",
    category: "Flooding",
    severity: "Critical",
    evidence: [],
    assignedTo: "WRK-203",
    classification: {
      category: "Flooding",
      severity: "Critical",
      confidence: 0.94,
      department: "Water",
      reason: "Flooding indicators and blocked flow conditions detected.",
      timestamp: Date.now(),
    },
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
];

const WORKER_SEED: Worker[] = [
  {
    id: "WRK-201",
    name: "Alicia Ruiz",
    email: "alicia@civicgrid.ai",
    department: "Roads",
    status: "available",
    assignedIssues: ["ISS-1001"],
    resolvedCount: 18,
    avgResolutionTime: 5.2,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
    updatedAt: Date.now(),
  },
  {
    id: "WRK-202",
    name: "Marcus Lee",
    email: "marcus@civicgrid.ai",
    department: "Water",
    status: "busy",
    assignedIssues: ["ISS-1003"],
    resolvedCount: 12,
    avgResolutionTime: 7.8,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
    updatedAt: Date.now(),
  },
  {
    id: "WRK-203",
    name: "Priya Shah",
    email: "priya@civicgrid.ai",
    department: "Water",
    status: "available",
    assignedIssues: ["ISS-1005"],
    resolvedCount: 14,
    avgResolutionTime: 6.1,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 70,
    updatedAt: Date.now(),
  },
  {
    id: "WRK-204",
    name: "Victor Gomez",
    email: "victor@civicgrid.ai",
    department: "Electricity",
    status: "offline",
    assignedIssues: [],
    resolvedCount: 9,
    avgResolutionTime: 8.5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 65,
    updatedAt: Date.now(),
  },
];

const PROFILE_SEED: GamificationProfile[] = [
  {
    citizenId: "CIT-100",
    reputation: 90,
    xp: 820,
    level: 4,
    badges: [
      { id: "first_report", name: "First Step", description: "Reported your first issue", icon: "🎯", awardedAt: Date.now(), criteria: "issues_reported" },
      { id: "verified_citizen", name: "Verified", description: "Had an issue verified", icon: "✅", awardedAt: Date.now(), criteria: "issues_verified" },
    ],
    issuesReported: 9,
    issuesVerified: 5,
    correctReports: 5,
    streakDays: 14,
    leaderboardRank: 1,
    civicCoins: 180,
    missionProgress: 75,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    updatedAt: Date.now(),
  },
  {
    citizenId: "CIT-101",
    reputation: 76,
    xp: 580,
    level: 3,
    badges: [{ id: "first_report", name: "First Step", description: "Reported your first issue", icon: "🎯", awardedAt: Date.now(), criteria: "issues_reported" }],
    issuesReported: 7,
    issuesVerified: 4,
    correctReports: 4,
    streakDays: 9,
    leaderboardRank: 2,
    civicCoins: 120,
    missionProgress: 60,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 52,
    updatedAt: Date.now(),
  },
  {
    citizenId: "CIT-102",
    reputation: 61,
    xp: 420,
    level: 2,
    badges: [],
    issuesReported: 5,
    issuesVerified: 2,
    correctReports: 2,
    streakDays: 6,
    leaderboardRank: 3,
    civicCoins: 95,
    missionProgress: 45,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 44,
    updatedAt: Date.now(),
  },
];

let issueStore: Issue[] = ISSUE_SEED.map((issue) => ({ ...issue }));
// Persist demo issue store across client navigations (client-only)
const LOCAL_KEY = "civicgrid_demo_issue_store";

function loadIssueStoreFromLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Issue[];
        if (Array.isArray(parsed)) {
          issueStore = parsed;
        }
      }
    }
  } catch (e) {
    // ignore localStorage failures
  }
}

function saveIssueStoreToLocal() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(issueStore));
    }
  } catch (e) {
    // ignore save failures
  }
}

// Attempt to hydrate from local storage on module load (client only)
loadIssueStoreFromLocal();
const workerStore: Worker[] = WORKER_SEED.map((worker) => ({ ...worker }));
let profileStore: GamificationProfile[] = PROFILE_SEED.map((profile) => ({ ...profile }));

const sortIssues = (items: Issue[]) =>
  [...items].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

const sortProfiles = (items: GamificationProfile[]) =>
  [...items].sort((a, b) => {
    if (b.reputation !== a.reputation) return b.reputation - a.reputation;
    return b.xp - a.xp;
  });

export const demoWorkflowService = {
  getIssues(): Issue[] {
    return sortIssues(issueStore);
  },

  getWorkers(): Worker[] {
    return [...workerStore];
  },

  getAssignedIssues(workerId: string): Issue[] {
    return sortIssues(issueStore.filter((issue) => issue.assignedTo === workerId));
  },

  assignIssue(issueId: string, workerId: string): Issue | null {
    const issue = issueStore.find((item) => item.id === issueId);
    if (!issue) return null;

    issue.assignedTo = workerId;
    issue.status = "Assigned";
    issue.updatedAt = Date.now();

    const worker = workerStore.find((entry) => entry.id === workerId);
    if (worker) {
      worker.assignedIssues = [...new Set([...worker.assignedIssues, issueId])];
      worker.updatedAt = Date.now();
    }
    saveIssueStoreToLocal();
    return { ...issue };
  },

  updateIssueStatus(issueId: string, status: IssueStatus): Issue | null {
    const issue = issueStore.find((item) => item.id === issueId);
    if (!issue) return null;

    issue.status = status;
    issue.updatedAt = Date.now();

    if (status === "Resolved") {
      issue.resolvedAt = Date.now();
    }

    if (status === "Resolved") {
      const profile = profileStore.find((entry) => entry.citizenId === issue.citizenId) || gamificationEngine.createProfile(issue.citizenId);
      const updatedProfile = gamificationEngine.recordIssueResolved(profile);
      profileStore = profileStore.some((entry) => entry.citizenId === issue.citizenId)
        ? profileStore.map((entry) => (entry.citizenId === issue.citizenId ? updatedProfile : entry))
        : [...profileStore, updatedProfile];
    }
    saveIssueStoreToLocal();

    return { ...issue };
  },

  getProfiles(): GamificationProfile[] {
    return sortProfiles(profileStore);
  },

  getLeaderboard(limit = 10): LeaderboardEntry[] {
    return gamificationEngine.getLeaderboard(this.getProfiles(), limit);
  },

  async createIssue(input: {
    citizenId: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
  }): Promise<{ issue: Issue; classification: Awaited<ReturnType<typeof aiClassificationService.classify>>; duplicate: ReturnType<typeof duplicateDetector.checkDuplicate> }> {
    const classification = await aiClassificationService.classify({
      title: input.title,
      description: input.description,
    });

    const issue: Issue = {
      id: `ISS-${String(2000 + issueStore.length + 1).padStart(4, "0")}`,
      citizenId: input.citizenId,
      title: input.title,
      description: input.description,
      location: {
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address,
      },
      status: "Reported",
      category: classification.category,
      severity: classification.severity,
      evidence: [],
      classification,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const duplicate = duplicateDetector.checkDuplicate(issue, issueStore);
    issueStore = [issue, ...issueStore];

    saveIssueStoreToLocal();

    const profile = profileStore.find((entry) => entry.citizenId === input.citizenId) || gamificationEngine.createProfile(input.citizenId);
    const updatedProfile = gamificationEngine.recordIssueReported(profile);
    profileStore = profileStore.some((entry) => entry.citizenId === input.citizenId)
      ? profileStore.map((entry) => (entry.citizenId === input.citizenId ? updatedProfile : entry))
      : [...profileStore, updatedProfile];

    return { issue, classification, duplicate };
  },
};

export default demoWorkflowService;

// Expose service on window for debugging / E2E test helpers (client-only)
try {
  if (typeof window !== "undefined") {
    (window as any).demoWorkflowService = demoWorkflowService;
  }
} catch (e) {
  // ignore
}
