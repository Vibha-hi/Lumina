// Server-only Lovable AI Gateway caller for LUMINA.AI analyses.
export type LuminaAnalysis = {
  overall_risk: number;
  privacy_risk: number;
  professional_risk: number;
  misunderstanding_risk: number;
  legal_risk: number;
  reach_potential: number;
  emotions: { emotion: string; value: number }[];
  personas: {
    name: string;
    risk: number;
    tone: "success" | "warning" | "danger";
    comment: string;
    avatar: string;
  }[];
  risky_phrases: { phrase: string; reason: string; suggestion: string }[];
  rewrite: string;
  summary: string;
};

const SYSTEM = `You are LUMINA.AI, an attention-economy visualizer and responsible-posting assistant.
Analyze a user's draft post BEFORE they publish it and return ONLY JSON matching this exact schema:
{
  "overall_risk": 0-100 int,
  "privacy_risk": 0-100 int,
  "professional_risk": 0-100 int,
  "misunderstanding_risk": 0-100 int,
  "legal_risk": 0-100 int,
  "reach_potential": 0-100 int,
  "emotions": [{"emotion":"Anger|Fear|Joy|Sadness|Neutral|Confidence","value":0-100}] (all 6, in that order),
  "personas": [
    {"name":"Recruiter","risk":0-100,"tone":"success|warning|danger","comment":"one sentence","avatar":"👔"},
    {"name":"Friend","risk":0-100,"tone":"...","comment":"...","avatar":"🙌"},
    {"name":"Family","risk":0-100,"tone":"...","comment":"...","avatar":"🏡"},
    {"name":"Journalist","risk":0-100,"tone":"...","comment":"...","avatar":"📝"},
    {"name":"Professor","risk":0-100,"tone":"...","comment":"...","avatar":"👨‍🏫"},
    {"name":"Stranger","risk":0-100,"tone":"...","comment":"...","avatar":"👤"}
  ],
  "risky_phrases": [{"phrase":"exact substring from post","reason":"short","suggestion":"safer wording"}] (0-6),
  "rewrite": "responsible rewrite preserving intent",
  "summary": "2-3 sentence AI judgment"
}
Tone rules: <35 success, 35-65 warning, >65 danger. Return valid JSON only, no markdown.`;

export async function analyzeWithLumina(text: string, platform: string): Promise<LuminaAnalysis> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Platform: ${platform}\nDraft post:\n"""${text}"""` },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted for this workspace.");
    throw new Error(`AI gateway error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content) as LuminaAnalysis;
}
