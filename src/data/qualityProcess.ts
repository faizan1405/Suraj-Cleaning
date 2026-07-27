export interface QualityStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  image: string;
}

export async function getQualitySteps(): Promise<QualityStep[]> {
  try {
    const res = await fetch("/api/admin/data/qualityProcess", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch quality steps");
    return res.json();
  } catch {
    console.error("Error fetching quality steps, returning empty array");
    return [];
  }
}
