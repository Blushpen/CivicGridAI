export type IssueStatus = "REPORTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence?: number;
  departmentId: string;
  ward: string;
  location: {
    latitude: number;
    longitude: number;
    description: string;
  };
  reporterId: string;
  assignedWorkerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type IssueCategory =
  | "Pothole"
  | "Road Damage"
  | "Garbage"
  | "Water Leak"
  | "Drain Blockage"
  | "Flooding"
  | "Broken Streetlight"
  | "Fallen Tree";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward: string;
  xp: number;
  reputation: number;
  civicCoins: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "CITIZEN" | "WORKER" | "SUPERVISOR" | "ADMIN";

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Worker {
  id: string;
  userId: string;
  departmentId: string;
  active: boolean;
}

export interface Assignment {
  id: string;
  issueId: string;
  workerId: string;
  assignedAt: string;
  status: IssueStatus;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  category?: IssueCategory[];
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  coins: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  xp: number;
  reputation: number;
  ward: string;
}

export interface IssueEvent {
  id: string;
  issueId: string;
  type: "REPORTED" | "CLASSIFIED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  message: string;
  createdAt: string;
}

export interface AIClassification {
  category: IssueCategory;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  department: string;
  reason: string;
}
