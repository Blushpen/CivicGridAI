import { IssueCategory } from "@/types";

export interface ReportInput {
  category?: IssueCategory | string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

const allowedCategories: string[] = [
  "Pothole",
  "Road Damage",
  "Garbage",
  "Water Leak",
  "Drain Blockage",
  "Flooding",
  "Broken Streetlight",
  "Fallen Tree",
];

export function validateReport(input: ReportInput) {
  const errors: string[] = [];
  if (!input.category) errors.push("Category is required.");
  else if (!allowedCategories.includes(String(input.category))) errors.push("Invalid category.");
  if (!input.description || !input.description.trim()) errors.push("Description is required.");
  if (typeof input.latitude !== "number" || typeof input.longitude !== "number") {
    errors.push("Location is required and must be valid coordinates.");
  }
  return {
    valid: errors.length === 0,
    errors,
  } as const;
}
