import { issues, issueEvents } from "@/services/mockDataService";
import { demoWorkflowService } from "@/lib/services";
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
  // If demoWorkflowService is available, delegate creation to it so that
  // the Admin/Worker dashboards (which read from demoWorkflowService)
  // observe newly created issues. Keep a fallback to the in-file mock store
  // for environments where the demo service is not present.
  try {
    if (demoWorkflowService && typeof demoWorkflowService.createIssue === "function") {
      const result = await demoWorkflowService.createIssue({
        citizenId: input.reporterId,
        title: input.title,
        description: input.description,
        latitude: input.location.latitude,
        longitude: input.location.longitude,
        address: input.location.description,
      });

      // demoWorkflowService returns { issue, classification, duplicate }
      // Mirror the created issue into the mockDataService stores so tests
      // and parts of the app that read `services/mockDataService` observe
      // the new issue. Also normalize the status to the legacy uppercase
      // values expected by tests.
      const created = (result.issue as unknown) as Issue;
      // Ensure reporterId is present for compatibility with legacy callers/tests
      created.reporterId = input.reporterId;
      // Normalize status to uppercase legacy values (e.g., 'REPORTED')
      if (created.status && typeof created.status === "string") {
        created.status = (created.status.toUpperCase() as unknown) as Issue["status"];
      }

      try {
        issues.unshift(created);

        if (result.classification) {
          issueEvents.unshift({
            id: generateId("event"),
            issueId: created.id,
            type: "CLASSIFIED",
            message: `AI classified as ${result.classification.category} (${Math.round(result.classification.confidence * 100)}% confidence).`,
            createdAt: new Date().toISOString(),
          });
        }

        // Ensure the REPORTED event is the first visible event for the issue (tests expect this)
        issueEvents.unshift({
          id: generateId("event"),
          issueId: created.id,
          type: "REPORTED",
          message: "Issue reported by citizen.",
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        // ignore mock store failures
      }

      return created;
    }
  } catch (e) {
    // Fall through to local mock behavior if delegation fails
  }

  // Fallback: keep previous in-file behavior so existing tests continue to work
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

  // Attach events: classification first (if any), then the REPORTED event so
  // the REPORTED event appears as the primary event for the issue.
  if (input.ai) {
    issueEvents.unshift({
      id: generateId("event"),
      issueId: id,
      type: "CLASSIFIED",
      message: `AI classified as ${input.ai.category} (${Math.round(input.ai.confidence * 100)}% confidence).`,
      createdAt: new Date().toISOString(),
    });
  }

  issueEvents.unshift({
    id: generateId("event"),
    issueId: id,
    type: "REPORTED",
    message: "Issue reported by citizen.",
    createdAt: now,
  });

  return issue;
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  // Prefer demoWorkflowService store if available
  try {
    if (demoWorkflowService && typeof demoWorkflowService.getIssues === "function") {
      return demoWorkflowService.getIssues().find((i) => i.id === id) as unknown as Issue | undefined;
    }
  } catch (e) {
    // ignore and fallback
  }

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

  try {
    if (demoWorkflowService && typeof demoWorkflowService.getIssues === "function") {
      return demoWorkflowService.getIssues().filter((i) => distance({ latitude: lat, longitude: lon }, i.location) <= radiusMeters) as unknown as Issue[];
    }
  } catch (e) {
    // fallback
  }

  return issues.filter((i) => distance({ latitude: lat, longitude: lon }, i.location) <= radiusMeters);
}
