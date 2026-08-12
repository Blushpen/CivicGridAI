/**
 * AI Classification Service
 * Provider-agnostic interface with deterministic mock fallback
 * Classifies issues into categories, severity, and department routing
 */

import type {
  AIClassificationResult,
  IssueCategory,
  SeverityLevel,
  Department,
} from "../types";

/** Configuration for AI provider */
interface AIProviderConfig {
  provider: "openai" | "anthropic" | "mock" | "local";
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/** Input for classification */
interface ClassificationInput {
  title: string;
  description: string;
  evidenceTexts?: string[]; // Descriptions from photos/uploads
}

/** Deterministic mock classifier for demo reliability */
class MockClassifier {
  private categoryKeywords: Record<IssueCategory, string[]> = {
    Pothole: [
      "pothole",
      "hole",
      "road damage",
      "surface",
      "crack",
      "broken asphalt",
    ],
    Garbage: [
      "garbage",
      "trash",
      "waste",
      "litter",
      "rubbish",
      "dumping",
      "garbage dump",
    ],
    "Blocked Drain": [
      "drain",
      "clogged",
      "blocked",
      "water stuck",
      "overflow",
      "drainage",
    ],
    "Water Leak": [
      "leak",
      "water",
      "pipe",
      "burst",
      "dripping",
      "leaking",
      "water pipe",
    ],
    Flooding: ["flood", "flooding", "water", "inundated", "submerged", "wet"],
    "Damaged Road": [
      "road",
      "pavement",
      "damage",
      "broken",
      "deteriorated",
      "uneven",
    ],
    "Broken Streetlight": [
      "streetlight",
      "light",
      "lamp",
      "broken",
      "not working",
      "dark",
      "electricity",
    ],
    Other: [],
  };

  classify(input: ClassificationInput): AIClassificationResult {
    const text = `${input.title} ${input.description} ${(input.evidenceTexts || []).join(" ")}`.toLowerCase();

    let category: IssueCategory = "Other";
    let maxMatches = 0;

    // Find category with most keyword matches
    for (const [cat, keywords] of Object.entries(this.categoryKeywords)) {
      const matches = keywords.filter((kw) => text.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        category = cat as IssueCategory;
      }
    }

    // Determine severity based on keywords
    const severity = this.determineSeverity(text, category);

    // Route to department based on category
    const department = this.routeDepartment(category);

    // Confidence based on keyword matches (mock model confidence)
    const confidence = Math.min(0.95, 0.5 + maxMatches * 0.15);

    return {
      category,
      severity,
      confidence,
      department,
      reason: `Issue classified as ${category} based on content analysis. Severity determined from keyword indicators.`,
      timestamp: Date.now(),
    };
  }

  private determineSeverity(text: string, category: IssueCategory): SeverityLevel {
    const criticalWords = ["critical", "dangerous", "hazard", "risk", "injury"];
    const highWords = ["blocking", "flooded", "major", "broken"];
    const mediumWords = ["damage", "issue", "problem"];

    if (criticalWords.some((w) => text.includes(w))) return "Critical";
    if (highWords.some((w) => text.includes(w))) return "High";
    if (mediumWords.some((w) => text.includes(w))) return "Medium";

    // Category-based defaults
    if (["Flooding", "Broken Streetlight"].includes(category)) return "High";
    if (["Water Leak", "Blocked Drain"].includes(category)) return "Medium";
    return "Low";
  }

  private routeDepartment(category: IssueCategory): Department {
    const routing: Record<IssueCategory, Department> = {
      Pothole: "Roads",
      Garbage: "Sanitation",
      "Blocked Drain": "Water",
      "Water Leak": "Water",
      Flooding: "Water",
      "Damaged Road": "Roads",
      "Broken Streetlight": "Electricity",
      Other: "Other",
    };
    return routing[category];
  }
}

/** Main AI Classification Service */
class AIClassificationService {
  private config: AIProviderConfig;
  private mockClassifier: MockClassifier;

  constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      provider: "mock",
      ...config,
    };
    this.mockClassifier = new MockClassifier();
  }

  /**
   * Classify an issue using configured AI provider
   * Falls back to mock if provider unavailable
   */
  async classify(input: ClassificationInput): Promise<AIClassificationResult> {
    // Use mock classifier for demo reliability
    if (this.config.provider === "mock") {
      return this.mockClassifier.classify(input);
    }

    // For production, would implement actual provider calls here
    // e.g., OpenAI API, Anthropic API, etc.
    // For now, fallback to mock
    return this.mockClassifier.classify(input);
  }

  /**
   * Batch classify multiple issues
   */
  async classifyBatch(
    inputs: ClassificationInput[]
  ): Promise<AIClassificationResult[]> {
    return Promise.all(inputs.map((input) => this.classify(input)));
  }

  /**
   * Update configuration (e.g., switch provider)
   */
  updateConfig(config: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): AIProviderConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const aiClassificationService = new AIClassificationService({
  provider:
    (process.env.AI_PROVIDER as "openai" | "anthropic" | "mock" | "local") ||
    "mock",
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL,
});

export type { ClassificationInput, AIProviderConfig };
export default AIClassificationService;
