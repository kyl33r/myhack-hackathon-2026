from __future__ import annotations

import json


async def get_matches(client, prompt: str) -> dict:
    """
    Send the prompt to Gemini and return the parsed JSON response.

    Raises:
        ValueError: if the response cannot be parsed as JSON or if any
                    match_score is outside the 0-100 range.
    """
    response = await client.generate_content_async(prompt)
    raw_text = response.text.strip()

    # Strip markdown code fences if Gemini wraps the output despite instructions
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        # Remove opening fence line (```json or ```)
        lines = lines[1:]
        # Remove closing fence if present
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        raw_text = "\n".join(lines).strip()

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Gemini response is not valid JSON: {exc}") from exc

    # Validate all match_score values
    all_groups = (
        parsed.get("mentors", [])
        + parsed.get("programmes", [])
        + parsed.get("corporate_partners", [])
        + parsed.get("investors", [])
        + parsed.get("service_providers", [])
    )

    for item in all_groups:
        score = item.get("match_score")
        if not isinstance(score, int) or not (0 <= score <= 100):
            raise ValueError(
                f"match_score out of range or invalid for actor_id={item.get('actor_id')!r}: {score!r}"
            )

    return parsed
