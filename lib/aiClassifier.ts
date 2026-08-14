import { AIClassification, IssueCategory } from "@/types";
import { LanguageService } from "@/services/languageService";

export interface AIClassifierInput {
  description: string;
  category?: IssueCategory;
  voiceText?: string;
  image?: string | null;
}

export interface AIClassifierProvider {
  classifyIssue(input: AIClassifierInput): Promise<AIClassification>;
}

export class AIClassifier {
  constructor(private provider: AIClassifierProvider) {}

  classifyIssue(input: AIClassifierInput) {
    return this.provider.classifyIssue(input);
  }
}

export class TextClassifierAdapter implements AIClassifierProvider {
  private readonly languageService = new LanguageService();

  async classifyIssue(input: AIClassifierInput): Promise<AIClassification> {
    const detection = this.languageService.normalizeText(input.description || input.voiceText || "");
    const normalized = detection.normalizedText || (input.description || input.voiceText || "").trim();
    const category = input.category ?? this.detectCategory(normalized);

    return {
      category,
      severity: this.mapSeverity(category),
      confidence: 0.91,
      department: this.mapDepartment(category),
      reason: `Detected ${category.toLowerCase()} indicators in ${detection.language === "und" ? "the provided" : detection.language.toUpperCase()} input.`,
    };
  }

  private detectCategory(description: string): IssueCategory {
    const lower = description.toLowerCase();
    if (lower.includes("pot hole") || lower.includes("pothole") || lower.includes("hole") || lower.includes("road") || lower.includes("crack")) {
      return "Pothole";
    }
    if (lower.includes("garbage") || lower.includes("trash") || lower.includes("dump") || lower.includes("waste") || lower.includes("litter")) {
      return "Garbage";
    }
    if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe")) {
      return "Water Leak";
    }
    if (lower.includes("drain") || lower.includes("blocked") || lower.includes("clog") || lower.includes("overflow")) {
      return "Drain Blockage";
    }
    if (lower.includes("light") || lower.includes("streetlight") || lower.includes("lamp") || lower.includes("dark")) {
      return "Broken Streetlight";
    }
    if (lower.includes("tree") || lower.includes("fallen")) {
      return "Fallen Tree";
    }
    if (lower.includes("flood") || lower.includes("flooding") || lower.includes("waterlogged")) {
      return "Flooding";
    }
    return "Pothole";
  }

  private mapDepartment(category: IssueCategory) {
    switch (category) {
      case "Pothole":
      case "Flooding":
        return "Roads";
      case "Garbage":
        return "Sanitation";
      case "Water Leak":
      case "Drain Blockage":
        return "Water Services";
      case "Broken Streetlight":
        return "Electrical";
      case "Fallen Tree":
        return "Parks";
      default:
        return "Roads";
    }
  }

  private mapSeverity(category: IssueCategory) {
    switch (category) {
      case "Flooding":
      case "Broken Streetlight":
      case "Water Leak":
        return "High";
      case "Pothole":
      case "Garbage":
        return "Medium";
      default:
        return "Low";
    }
  }
}

export class MockAIClassifierProvider extends TextClassifierAdapter {}

export class FutureVisionClassifierAdapter implements AIClassifierProvider {
  async classifyIssue(input: AIClassifierInput): Promise<AIClassification> {
    const textAdapter = new TextClassifierAdapter();
    return textAdapter.classifyIssue({
      ...input,
      description: input.description || input.voiceText || "",
    });
  }
}
