import { AIClassification, IssueCategory } from "@/types";

export interface AIClassifierProvider {
  classifyIssue(input: { description: string; category?: IssueCategory }): Promise<AIClassification>;
}

export class AIClassifier {
  constructor(private provider: AIClassifierProvider) {}

  classifyIssue(input: { description: string; category?: IssueCategory }) {
    return this.provider.classifyIssue(input);
  }
}

export class MockAIClassifierProvider implements AIClassifierProvider {
  async classifyIssue(input: { description: string; category?: IssueCategory }): Promise<AIClassification> {
    const category = input.category ?? this.detectCategory(input.description);
    return {
      category,
      severity: this.mapSeverity(category),
      confidence: 0.92,
      department: this.mapDepartment(category),
      reason: `Detected ${category.toLowerCase()} characteristics from the reported issue.`,
    };
  }

  private detectCategory(description: string): IssueCategory {
    const lower = description.toLowerCase();
    if (lower.includes("pot hole") || lower.includes("pothole") || lower.includes("road")) {
      return "Pothole";
    }
    if (lower.includes("garbage") || lower.includes("trash") || lower.includes("dump")) {
      return "Garbage";
    }
    if (lower.includes("water") || lower.includes("leak")) {
      return "Water Leak";
    }
    if (lower.includes("drain") || lower.includes("blocked") || lower.includes("clog")) {
      return "Drain Blockage";
    }
    if (lower.includes("light") || lower.includes("streetlight")) {
      return "Broken Streetlight";
    }
    if (lower.includes("tree") || lower.includes("fallen")) {
      return "Fallen Tree";
    }
    return "Road Damage";
  }

  private mapDepartment(category: IssueCategory) {
    switch (category) {
      case "Pothole":
      case "Road Damage":
        return "Roads";
      case "Garbage":
        return "Sanitation";
      case "Water Leak":
      case "Drain Blockage":
        return "Water Services";
      case "Flooding":
        return "Emergency Response";
      case "Broken Streetlight":
        return "Electrical";
      case "Fallen Tree":
        return "Parks";
    }
  }

  private mapSeverity(category: IssueCategory) {
    switch (category) {
      case "Flooding":
      case "Broken Streetlight":
        return "High";
      case "Pothole":
      case "Road Damage":
      case "Water Leak":
        return "Medium";
      default:
        return "Low";
    }
  }
}
