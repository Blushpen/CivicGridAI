import { describe, it, expect, beforeEach } from 'vitest';
import { createIssue } from '../services/issueService';
import { issues, issueEvents } from '../services/mockDataService';
import { IssueCategory, AIClassification } from '../types';

describe('issueService', () => {
  beforeEach(() => {
    // clear any created test entries (we assume initial seed length <= 10)
    while (issues.length > 10) issues.pop();
    while (issueEvents.length > 10) issueEvents.pop();
  });

  it('creates issue with REPORTED status and reporter id', async () => {
    const beforeCount = issues.length;
    const beforeEvents = issueEvents.length;
    const created = await createIssue({
      title: 'Test issue',
      category: 'Pothole' as IssueCategory,
      description: 'desc',
      reporterId: 'user-test',
      location: { latitude: 12.97, longitude: 77.59, description: 'loc' },
      image: null,
      ai: null,
    });

    expect(created.status).toBe('REPORTED');
    expect(created.reporterId).toBe('user-test');
    expect(issues.length).toBeGreaterThan(beforeCount);
    expect(issueEvents.length).toBeGreaterThan(beforeEvents);

    const ev = issueEvents.find((e) => e.issueId === created.id);
    expect(ev).toBeDefined();
    expect(ev?.type).toBe('REPORTED');
    expect(new Date(created.createdAt).getTime()).toBeGreaterThan(0);
  });

  it('attaches AI classification event when AI present', async () => {
    const created = await createIssue({
      title: 'AI issue',
      category: 'Garbage' as IssueCategory,
      description: 'desc',
      reporterId: 'user-test',
      location: { latitude: 12.97, longitude: 77.59, description: 'loc' },
      image: null,
      ai: { category: 'Garbage', severity: 'Low', confidence: 0.9, department: 'Sanitation', reason: 'detected' } as AIClassification,
    });

    const classified = issueEvents.find((e) => e.issueId === created.id && e.type === 'CLASSIFIED');
    expect(classified).toBeDefined();
  });
});
