/**
 * API client for Stock Image Helper backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7071/api";

export interface BriefAnalysis {
  subject: string;
  setting: string;
  lighting: string;
  mood: string;
  composition: string;
  style: string;
}

export interface SearchQuery {
  query: string;
  platform: string;
  url: string;
  reasoning: string;
}

export interface GenerateResponse {
  brief_analysis: BriefAnalysis;
  queries: SearchQuery[];
  model_used: string;
}

export interface GenerateRequest {
  brief: string;
  model?: string;
  platforms?: string[];
}

/**
 * Generate search queries from a creative brief
 */
export async function generateQueries(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brief: request.brief,
      model: request.model || "gpt-4o",
      platforms: request.platforms || ["getty", "shutterstock"],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate queries");
  }

  return response.json();
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<{
  status: string;
  openai_configured: boolean;
  anthropic_configured: boolean;
  google_configured: boolean;
}> {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
