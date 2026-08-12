import { Issue, User, Department, Worker, Badge, Mission, Reward, IssueEvent } from "@/types";

export const departments: Department[] = [
  { id: "dept-roads", name: "Roads", description: "Maintains roads, sidewalks, and street repair." },
  { id: "dept-sanitation", name: "Sanitation", description: "Handles waste collection and public cleanliness." },
  { id: "dept-water", name: "Water Services", description: "Manages water supply, drainage, and leak repair." },
  { id: "dept-parks", name: "Parks", description: "Maintains green spaces and fallen tree removal." },
];

export const users: User[] = [
  { id: "user-citizen-1", name: "Asha Rao", email: "asha.rao@example.com", role: "CITIZEN", ward: "Ward 3", xp: 340, reputation: 62, civicCoins: 120, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "user-citizen-2", name: "Rohan Singh", email: "rohan.singh@example.com", role: "CITIZEN", ward: "Ward 5", xp: 420, reputation: 71, civicCoins: 150, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "user-worker-1", name: "Neha Patel", email: "neha.patel@example.com", role: "WORKER", ward: "Ward 3", xp: 180, reputation: 55, civicCoins: 80, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "user-supervisor-1", name: "Sanjay Mehta", email: "sanjay.mehta@example.com", role: "SUPERVISOR", ward: "Ward 1", xp: 520, reputation: 84, civicCoins: 220, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "user-admin-1", name: "Priya Sharma", email: "priya.sharma@example.com", role: "ADMIN", ward: "Ward 1", xp: 610, reputation: 89, civicCoins: 310, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const workers: Worker[] = [
  { id: "worker-1", userId: "user-worker-1", departmentId: "dept-roads", active: true },
  { id: "worker-2", userId: "user-worker-2", departmentId: "dept-sanitation", active: true },
];

export const badges: Badge[] = [
  { id: "badge-first-report", title: "First Report", description: "Submitted your first verified report." },
  { id: "badge-road-guardian", title: "Road Guardian", description: "Resolved three road-related issues." },
  { id: "badge-community-hero", title: "Community Hero", description: "Completed a mission and helped the community." },
];

export const missions: Mission[] = [
  { id: "mission-road-guardian", title: "Road Guardian Challenge", description: "Complete 3 verified road-related contributions.", targetCount: 3, category: ["Pothole", "Road Damage"], rewardXp: 50, rewardCoins: 30, completed: false },
];

export const rewards: Reward[] = [
  { id: "reward-civiccoin-50", title: "CivicCoins Pack", description: "Earn 50 CivicCoins for community support.", coins: 50 },
];

export const issues: Issue[] = [
  {
    id: "issue-1",
    title: "Pothole near market road",
    category: "Pothole",
    description: "A large pothole is forming near the market entrance and causing traffic hazards.",
    status: "REPORTED",
    severity: "High",
    confidence: 0.94,
    departmentId: "dept-roads",
    ward: "Ward 3",
    location: { latitude: 12.9716, longitude: 77.5946, description: "Market Road, Ward 3" },
    reporterId: "user-citizen-1",
    assignedWorkerId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "issue-2",
    title: "Overflowing garbage bin",
    category: "Garbage",
    description: "The public bin on the bus stop is overflowing and attracting pests.",
    status: "ASSIGNED",
    severity: "Medium",
    confidence: 0.88,
    departmentId: "dept-sanitation",
    ward: "Ward 5",
    location: { latitude: 12.9750, longitude: 77.5990, description: "Bus stop, Ward 5" },
    reporterId: "user-citizen-2",
    assignedWorkerId: "worker-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "issue-3",
    title: "Leaking water main",
    category: "Water Leak",
    description: "A water main is leaking near the school gate and flooding the sidewalk.",
    status: "IN_PROGRESS",
    severity: "High",
    confidence: 0.91,
    departmentId: "dept-water",
    ward: "Ward 1",
    location: { latitude: 12.9680, longitude: 77.5950, description: "School gate, Ward 1" },
    reporterId: "user-citizen-1",
    assignedWorkerId: "worker-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "issue-4",
    title: "Broken streetlight at corner",
    category: "Broken Streetlight",
    description: "Streetlight is not working at the corner of Park Avenue.",
    status: "RESOLVED",
    severity: "Low",
    confidence: 0.83,
    departmentId: "dept-parks",
    ward: "Ward 3",
    location: { latitude: 12.9725, longitude: 77.5930, description: "Park Avenue corner, Ward 3" },
    reporterId: "user-citizen-2",
    assignedWorkerId: "worker-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const issueEvents: IssueEvent[] = [
  { id: "event-1", issueId: "issue-1", type: "REPORTED", message: "Issue reported by citizen.", createdAt: new Date().toISOString() },
  { id: "event-2", issueId: "issue-2", type: "ASSIGNED", message: "Issue assigned to sanitation worker.", createdAt: new Date().toISOString() },
  { id: "event-3", issueId: "issue-3", type: "IN_PROGRESS", message: "Water leak repair is in progress.", createdAt: new Date().toISOString() },
];
