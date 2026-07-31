import { readJsonFile } from "@/lib/db";

export interface QualityStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  image: string;
}

/**
 * Read quality process steps directly from the data layer (MongoDB with JSON fallback).
 * Replaces the broken internal fetch() call.
 */
export async function getQualitySteps(): Promise<QualityStep[]> {
  try {
    const data = await readJsonFile<QualityStep[]>("qualityProcess.json");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching quality steps:", err instanceof Error ? err.message : err);
    return [];
  }
}
