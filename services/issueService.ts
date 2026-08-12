import { issues, issueEvents } from "@/services/mockDataService";
import { Issue, IssueEvent, IssueCategory, AIClassification } from "@/types";

function generateId(prefix = "issue") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface CreateIssueInput {
  title: string;
  category: IssueCategory;
  description: string;
  reporterId: string;
  location: { latitude: number; longitude: number; description: string };
  image?: string | null;
  ai?: AIClassification | null;
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const id = generateId();
  const now = new Date().toISOString();
  const issue: Issue = {
    id,
    title: input.title,
    category: input.category,
    description: input.description,
    status: "REPORTED",
    severity: input.ai?.severity ?? "Low",
    confidence: input.ai?.confidence,
    departmentId: input.ai?.department ?? "",
    ward: "Unknown",
    location: input.location,
    reporterId: input.reporterId,
    assignedWorkerId: undefined,
    createdAt: now,
    updatedAt: now,
  };

  issues.unshift(issue);

  const event: IssueEvent = {
    id: generateId("event"),
    issueId: id,
    type: "REPORTED",
    message: "Issue reported by citizen.",
    createdAt: now,
  };

  issueEvents.unshift(event);

  if (input.ai) {
    issueEvents.unshift({
      id: generateId("event"),
      issueId: id,
      type: "CLASSIFIED",
      message: `AI classified as ${input.ai.category} (${Math.round(input.ai.confidence * 100)}% confidence).`,
      createdAt: new Date().toISOString(),
    });
  }

  return issue;
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  return issues.find((i) => i.id === id);
}

export async function listNearbyIssues(lat: number, lon: number, radiusMeters = 500): Promise<Issue[]> {
  // Simple distance calc reused from duplicate detector logic
  function toRad(v: number) {
    return (v * Math.PI) / 180;
  }

  function distance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const dLat = lat2 - lat1;
    const dLon = toRad(b.longitude - a.longitude);
    const r = 6371000;
    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return r * c;
  }

  return issues.filter((i) => distance({ latitude: lat, longitude: lon }, i.location) <= radiusMeters);
}
