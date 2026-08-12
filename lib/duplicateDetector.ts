import { Issue, IssueCategory, IssueStatus } from "@/types";

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  message?: string;
  duplicateIssue?: Issue;
}

export function detectDuplicateIssue(issue: Pick<Issue, "category" | "location" | "createdAt" | "status">, existingIssues: Issue[]): DuplicateDetectionResult {
  const maxDistanceMeters = 250;
  const maxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days

  const issueTime = new Date(issue.createdAt).getTime();

  const candidate = existingIssues.find((candidateIssue) => {
    if (candidateIssue.status === "RESOLVED" || candidateIssue.status === "REJECTED") return false;
    if (candidateIssue.category !== issue.category) return false;

    const candidateTime = new Date(candidateIssue.createdAt).getTime();
    if (Math.abs(issueTime - candidateTime) > maxAgeMs) return false;

    const distance = calculateDistanceMeters(issue.location, candidateIssue.location);
    return distance <= maxDistanceMeters;
  });

  if (!candidate) {
    return { isDuplicate: false };
  }

  return {
    isDuplicate: true,
    duplicateIssue: candidate,
    message: `Possible duplicate issue found ${Math.round(calculateDistanceMeters(issue.location, candidate.location))}m away.`,
  };
}

function calculateDistanceMeters(a: Issue["location"], b: Issue["location"]) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLat = lat2 - lat1;
  const dLon = toRad(b.longitude - a.longitude);
  const r = 6371000;
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return r * c;
}
