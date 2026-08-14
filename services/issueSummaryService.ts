export interface IssueSummaryInput {
  description: string;
  category?: string;
  severity?: string;
  department?: string;
}

export interface IssueSummaryResult {
  category: string;
  severity: string;
  department: string;
  summary: string;
}

export function generateIssueSummary(input: IssueSummaryInput): IssueSummaryResult {
  const description = input.description?.trim() ?? '';
  const category = input.category ?? 'Issue';
  const severity = input.severity ?? 'Medium';
  const department = input.department ?? 'Unassigned';

  if (!description) {
    return {
      category,
      severity,
      department,
      summary: `${category} reported with the provided civic issue details.`,
    };
  }

  const lower = description.toLowerCase();
  const busStopMention = lower.includes('bus stop') ? 'near bus stop' : lower.includes('near') ? 'in the reported area' : 'in the community';

  if (lower.includes('pothole') || lower.includes('gudda') || lower.includes('గుంత')) {
    return {
      category: 'Pothole',
      severity: severity || 'High',
      department: department || 'Roads',
      summary: `Large pothole reported ${busStopMention} causing traffic and safety concerns.`,
    };
  }

  if (lower.includes('garbage') || lower.includes('trash') || lower.includes('litter')) {
    return {
      category: 'Garbage',
      severity: severity || 'Medium',
      department: department || 'Sanitation',
      summary: `Garbage accumulation reported ${busStopMention} affecting cleanliness and public hygiene.`,
    };
  }

  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
    return {
      category: 'Water Leak',
      severity: severity || 'High',
      department: department || 'Water Services',
      summary: `Water leak reported ${busStopMention} affecting local utilities and public safety.`,
    };
  }

  const summaryBase = `${category} reported ${busStopMention} with civic service impact.`;

  return {
    category,
    severity,
    department,
    summary: summaryBase,
  };
}
