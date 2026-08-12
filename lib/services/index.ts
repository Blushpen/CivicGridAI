/**
 * Services barrel export
 * Central point for accessing all core services
 */

export { aiClassificationService, type ClassificationInput, type AIProviderConfig } from "./aiClassifier";
export { duplicateDetector, type DuplicateDetectionConfig } from "./duplicateDetector";
export { gamificationEngine } from "./gamificationEngine";
export { BADGE_DEFINITIONS } from "./gamificationEngine";
export { demoWorkflowService } from "./demoWorkflowService";
