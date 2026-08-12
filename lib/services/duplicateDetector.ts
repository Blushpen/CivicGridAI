/**
 * Duplicate Detection Service
 * Identifies duplicate or nearby issues to prevent redundant reporting
 * Uses location proximity and content similarity
 */

import type { Issue, DuplicateDetectionResult } from "./types";

/** Configuration for duplicate detection */
interface DuplicateDetectionConfig {
  proximityRadiusMeters: number; // How far to look for nearby issues
  similarityThreshold: number; // 0-1, minimum similarity to flag as duplicate
  timeWindowHours: number; // Only check issues within this time window
}

/** Duplicate detection algorithm */
class DuplicateDetector {
  private config: DuplicateDetectionConfig;

  constructor(config?: Partial<DuplicateDetectionConfig>) {
    this.config = {
      proximityRadiusMeters: 100, // 100 meters default
      similarityThreshold: 0.7, // 70% similarity
      timeWindowHours: 48, // Last 48 hours
      ...config,
    };
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate text similarity using simple string comparison
   * Returns 0-1 similarity score
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple implementation: common words / total unique words
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    let commonCount = 0;
    words1.forEach((w) => {
      if (words2.has(w)) commonCount++;
    });

    const totalUnique = new Set([...words1, ...words2]).size;
    if (totalUnique === 0) return 0;

    return commonCount / totalUnique;
  }

  /**
   * Check if a new issue is a duplicate of existing issues
   */
  checkDuplicate(newIssue: Issue, existingIssues: Issue[]): DuplicateDetectionResult {
    const now = Date.now();
    const timeWindowMs = this.config.timeWindowHours * 3600000;

    // Filter issues within time window
    const recentIssues = existingIssues.filter((issue) => {
      return now - issue.createdAt < timeWindowMs;
    });

    let bestMatch: {
      issue: Issue;
      similarity: number;
      confidence: number;
    } | null = null;

    // Check each recent issue
    for (const existingIssue of recentIssues) {
      // Calculate location proximity
      const distance = this.calculateDistance(
        newIssue.location.latitude,
        newIssue.location.longitude,
        existingIssue.location.latitude,
        existingIssue.location.longitude
      );

      // Skip if too far away
      if (distance > this.config.proximityRadiusMeters) {
        continue;
      }

      // Calculate text similarity
      const textContent = `${newIssue.title} ${newIssue.description}`;
      const existingContent = `${existingIssue.title} ${existingIssue.description}`;
      const textSimilarity = this.calculateTextSimilarity(
        textContent,
        existingContent
      );

      // Combine proximity and text similarity
      const proximityScore = 1 - distance / this.config.proximityRadiusMeters;
      const combinedSimilarity = textSimilarity * 0.6 + proximityScore * 0.4;

      // Track best match
      if (
        combinedSimilarity > (bestMatch?.similarity || 0) &&
        combinedSimilarity > this.config.similarityThreshold
      ) {
        bestMatch = {
          issue: existingIssue,
          similarity: combinedSimilarity,
          confidence: Math.min(0.99, textSimilarity * 0.7 + proximityScore * 0.3),
        };
      }
    }

    // Return result
    if (bestMatch) {
      return {
        isDuplicate: true,
        confidence: bestMatch.confidence,
        matchedIssueId: bestMatch.issue.id,
        similarity: bestMatch.similarity,
        reason: `This issue appears to be a duplicate of issue #${bestMatch.issue.id}. Similar location and content detected.`,
      };
    }

    return {
      isDuplicate: false,
      confidence: 0,
      similarity: 0,
      reason: "No duplicates detected.",
    };
  }

  /**
   * Find nearby (related but not necessarily duplicate) issues
   */
  findNearby(issue: Issue, existingIssues: Issue[]): string[] {
    const nearby: string[] = [];
    const radiusMeters = this.config.proximityRadiusMeters * 2; // Use larger radius for "nearby"

    for (const existing of existingIssues) {
      if (existing.id === issue.id) continue; // Skip same issue

      const distance = this.calculateDistance(
        issue.location.latitude,
        issue.location.longitude,
        existing.location.latitude,
        existing.location.longitude
      );

      if (distance < radiusMeters) {
        nearby.push(existing.id);
      }
    }

    return nearby;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<DuplicateDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): DuplicateDetectionConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const duplicateDetector = new DuplicateDetector({
  proximityRadiusMeters: 100,
  similarityThreshold: 0.7,
  timeWindowHours: 48,
});

export type { DuplicateDetectionConfig };
export default DuplicateDetector;
