export function buildMatchingPrompt(
  startup: Record<string, unknown>,
  mentors: unknown[],
  programmes: unknown[],
  partners: unknown[],
): string {
  return `You are an AI matching engine for a startup ecosystem portal.

Given the startup profile below and the available ecosystem actors, identify the best matches.

## Startup Profile
${JSON.stringify(startup, null, 2)}

## Available Mentors
${JSON.stringify(mentors, null, 2)}

## Available Programmes
${JSON.stringify(programmes, null, 2)}

## Available Partners (corporate, investor, service_provider)
${JSON.stringify(partners, null, 2)}

## Instructions

Return ONLY a valid JSON object — no markdown, no code fences, no explanations.

The JSON must have exactly these keys:
- "mentors": array of top 3 mentor matches
- "programmes": array of top 3 programme matches
- "corporate_partners": array of top 2 corporate partner matches
- "investors": array of top 2 investor matches
- "service_providers": array of top 2 service provider matches

Each item must have exactly these fields:
- "actor_id": string
- "actor_name": string
- "actor_type": "mentor" | "programme" | "partner"
- "partner_type": "corporate" | "investor" | "service_provider" | null
- "match_score": integer 0–100
- "match_reason": string — 2 sentences explaining the match

Do not include any text outside the JSON object.`
}
