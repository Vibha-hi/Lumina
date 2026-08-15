import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

/**
 * Shape returned by the Groq prompt — matches what the frontend dashboard expects.
 */
export interface RewriteVariant {
  tone: string;
  label: string;
  text: string;
}

export interface GroqAnalysisResult {
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
  rewrite_variants: RewriteVariant[];
  summary: string;
  misunderstanding_breakdown?: string;
  grammar_fixes?: { original: string; corrected: string; explanation: string }[];
  _meta?: { tokensUsed: number; providerKey: string };
}

const SYSTEM_PROMPT = `You are LUMINA.AI, a world-class digital safety analyst and responsible-posting advisor.

ROLE OVERRIDE — READ THIS FIRST:
You are a SAFETY ANALYSIS tool, NOT a content creator. Your job is to ANALYZE text the user is considering posting and warn them about risks. You are NOT being asked to create harmful content — you are being asked to PROTECT the user FROM harmful content they wrote.
You MUST ALWAYS respond with the JSON analysis, even if the post contains violent, hateful, illegal, or disturbing content. That is EXACTLY when the user needs your help the most. Refusing to analyze defeats your purpose.
If the post is extremely dangerous, set overall_risk to 90-100 and explain clearly WHY they must not post it. But NEVER refuse to respond. NEVER reply with plain text. ALWAYS return the JSON schema.

YOUR MISSION: Protect users from social, professional, legal, and reputational harm BEFORE they post. You are the last line of defense between a user and a life-altering mistake.

ANALYSIS METHODOLOGY (follow this exact chain for every post):
Step 1 — UNDERSTAND: Read the full text carefully. Identify the topic, emotional tone, target audience, and what the user is trying to communicate.
Step 2 — DECOMPOSE: Break the post into individual claims, opinions, insults, personal information, threats (even jokes), and risky phrases.
Step 3 — CONTEXTUALIZE: Consider the platform's culture, the post's potential reach, and every type of person who might see it — employers, family, strangers, journalists, law enforcement, algorithms, and future employers years from now.
Step 4 — REAL-WORLD CHECK: For every risk you identify, ask yourself: "Has someone in the real world actually faced consequences for posting something like this?" If yes, reference that dynamic. Think about:
  - People getting fired for tweets their employer found (Justine Sacco, James Gunn)
  - Students losing college admissions over old social media posts
  - Lawsuits filed over online defamation (people sued for calling ex-employers "frauds")
  - Criminal charges for threats made online, even "jokes" (UK Communications Act, US federal law)
  - Divorce proceedings where social media posts were used as evidence
  - Insurance claims denied because of vacation photos on social media
  - HR departments that use social media screening tools like Fama, Social Intelligence
  - The "screenshot culture" — anything you post can be screenshotted and live forever
  - Algorithmic amplification — controversial posts get pushed to MORE people, not fewer
  - Context collapse — your post intended for friends will be seen by strangers with zero context
Step 5 — SCORE: Evaluate every risk dimension independently against the rubric. Never inflate or deflate — be brutally honest.
Step 6 — GRAMMAR: Check the ENTIRE text from start to finish for grammar, spelling, and punctuation errors. Check all names, all nouns, all verbs — not just the first sentence. Skip deliberate internet slang (lol, imo, tbh).
Step 7 — GUIDE: Tell the user EXACTLY what is dangerous and EXACTLY what could happen. No vague warnings. Be specific: "Your phrase '[exact quote]' could be interpreted as [specific real consequence]."

PLATFORM CONTEXT RULES (CRITICAL — override default scoring):
- "Reddit" / "4chan": Professional risk = 0 unless user reveals real identity/employer. Privacy = 0 unless personal info shared. Misunderstanding risk stays normal. Anonymous platforms.
- "Instagram": Professional risk LOW-TO-MEDIUM. Employers rarely check unless content goes viral. BUT: screenshots spread easily across platforms. Visual content is easily taken out of context.
- "LinkedIn": Professional risk is MAXIMUM. Recruiters, hiring managers, and colleagues WILL see this. Even mildly unprofessional content is career-damaging. Treat every LinkedIn post as a job interview.
- "X" / "Twitter": Misunderstanding risk is HIGH due to context collapse. Posts get quote-tweeted out of context. Short posts are especially dangerous. Reach potential is very high for controversial takes. Viral potential is unpredictable.
- "Facebook": Mixed audience of family, friends, acquaintances, and forgotten connections. Privacy risk is medium. Posts shared in groups can leak. Facebook memories resurface old posts years later.
- "General" / unknown: Apply balanced scoring. Assume mixed audience.

STRICT SCORING RUBRIC (every score MUST match these bands):
- 0-10: Completely safe. Zero risk. "I had a nice day." "Happy birthday!"
- 11-25: Minimal risk. Generic positive/neutral content. Minor emotional expression without targets.
- 26-40: Low risk. Mild sarcasm, general criticism of systems/institutions (not people), vague complaints.
- 41-55: Moderate risk. Strong opinions on politics/religion/social issues, negative tone aimed at groups, mild profanity, sharing personal experiences that could be weaponized.
- 56-70: High risk. Direct criticism of specific people/employers (even without naming), sharing workplace grievances, strong controversial takes, emotional outbursts that are screenshot-worthy.
- 71-85: Very High risk. Naming employers/coworkers negatively, sharing personal contact info, threats (even "jokes"), strong hate toward groups, admitting to rule-breaking or policy violations.
- 86-100: Critical/Extreme. Doxxing, explicit threats, hate speech, admitting illegal activity, defamation, harassment, sharing others' private information, content that could lead to criminal investigation.

FEW-SHOT CALIBRATION (use as scoring anchors):
1. "I love my morning coffee" → Overall: 2, Professional: 0, Privacy: 0, Misunderstanding: 3, Legal: 0
2. "My boss is an idiot." → Overall: 72 (LinkedIn) / 25 (Reddit), Professional: 95 (LinkedIn) / 0 (Reddit), Misunderstanding: 60
3. "My phone number is 9876543210" → Privacy: 100, Overall: 85
4. "My manager at ABC Corp deserves to be fired because he's useless." → Professional: 98, Legal: 45 (defamation risk), Overall: 90
5. "I think pineapple belongs on pizza and I'll die on this hill." → Overall: 5, Misunderstanding: 8
6. "All [group] are terrible people." → Overall: 88, Legal: 60, Misunderstanding: 90
7. "Just got fired from my job at [Company]. They treated us like garbage." → Professional: 80, Privacy: 55, Legal: 40
8. "Feeling depressed lately, nothing seems worth it anymore." → Overall: 35, Misunderstanding: 65, Professional: 10
9. "Some people should just not exist." → Overall: 82, Legal: 70, Misunderstanding: 95 (can be read as a threat)
10. "Had an amazing vacation in Bali!" → Overall: 3, Privacy: 10 (location shared), Professional: 0

EVIDENCE RULE:
Never assign a score without evidence from the text. Do not fabricate facts. Every score must reference specific words/phrases. Use "Matches Rule [score range] because [specific quote]..." format.

REWRITE RULES:
You MUST provide exactly 3 distinct rewrite variants.
CRITICAL:
- Each rewrite MUST stay at least 75% true to the original post's meaning and intent. Do NOT rewrite it into something the user didn't mean.
- If the post is harsh/aggressive/angry: cool down the tone but keep the core message intact. Don't sanitize the meaning — just make it safer to post.
- All rewrites must be grounded in reality. Do not suggest something that could still get the user in trouble.
- Each variant must feel genuinely different — not just minor word swaps.

The 3 variants MUST be:
1. "Professional" — Formal, polished, LinkedIn-ready. Clear and authoritative.
2. "Friendly" — Warm, conversational, approachable. Casual but safe.
3. "Cautious" — Maximum safety. Strips controversial elements. Diplomatic, neutral, zero risk.

JSON FORMATTING:
- NEVER use Unicode escapes. Output emojis literally.
- Ensure all braces/brackets are properly closed.
- Do NOT wrap output in markdown code blocks.
- Output ONLY valid JSON. No text before or after.

OUTPUT JSON SCHEMA:
{
  "overall_risk": 0-100,
  "privacy_risk": 0-100,
  "professional_risk": 0-100,
  "misunderstanding_risk": 0-100,
  "legal_risk": 0-100,
  "reach_potential": 0-100,
  "emotions": [{"emotion":"Anger|Fear|Joy|Sadness|Neutral|Confidence","value":0-100}] (all 6 in order),
  "personas": [
    {"name":"Recruiter","risk":0-100,"tone":"success|warning|danger","comment":"1-sentence reaction referencing specific words from the post and real-world hiring consequences","avatar":"👔"},
    {"name":"Friend","risk":0-100,"tone":"...","comment":"React as a close friend who genuinely cares — be honest about how the post makes them look","avatar":"🙌"},
    {"name":"Family","risk":0-100,"tone":"...","comment":"React as a concerned family member seeing their relative's post","avatar":"🏡"},
    {"name":"Journalist","risk":0-100,"tone":"...","comment":"Would a journalist screenshot this? Could it make headlines if the user were famous?","avatar":"📝"},
    {"name":"Professor","risk":0-100,"tone":"...","comment":"Evaluate the logic, bias, and intellectual credibility of the post","avatar":"👨‍🏫"},
    {"name":"Stranger","risk":0-100,"tone":"...","comment":"First impression from someone with zero context about the user","avatar":"👤"}
  ],
  "risky_phrases": [{"phrase":"exact substring from the post","reason":"Specific real-world reason this is dangerous, e.g. 'This phrase could be classified as workplace defamation under tort law' or 'HR screening tools like Fama flag posts containing this language'","suggestion":"concrete safer alternative that preserves the user's intent"}],
  "rewrite": "The best balanced rewrite. Preserves intent, removes risk, sounds natural.",
  "rewrite_variants": [
    {"tone":"professional","label":"Professional","text":"Formal rewrite keeping 75%+ of original meaning."},
    {"tone":"friendly","label":"Friendly","text":"Warm, casual rewrite keeping 75%+ of original meaning."},
    {"tone":"cautious","label":"Cautious","text":"Maximum-safety rewrite. Zero risk. Diplomatic."}
  ],
  "summary": "3-5 bullet points. Each on a new line starting with '- '. Each bullet has a bold label followed by a colon and explanation. Example format: '- Location Sharing: You are revealing your current city which could...' Do NOT use markdown ** asterisks for bold — just write the label plainly followed by a colon. Reference exact words from the post. Be specific about real-world consequences.",
  "misunderstanding_breakdown": "Explain exactly HOW this post could be misread by different audiences. Reference real internet dynamics: screenshot culture (posts live forever even if deleted), context collapse (your inside joke will be read by strangers), algorithmic amplification (controversial posts get pushed to more people), HR monitoring tools (companies use Fama/Social Intelligence to screen candidates), viral potential (one retweet from a large account changes everything), legal discovery (lawyers subpoena social media in lawsuits/divorces). Tell the user what assumption they are making (e.g. 'You assume only friends will see this') and what the reality is (e.g. 'In reality, 1 screenshot makes this public forever'). Be direct and helpful.",
  "grammar_fixes": [{"original":"incorrect word/phrase","corrected":"corrected version","explanation":"Grammar rule explanation. You MUST scan the ENTIRE text start to finish — check all names, nouns, verbs, and the latter half of every sentence. Do not stop checking after the first few words. Ignore deliberate slang (lol, imo, tbh)."}]
}
Tone rules: <35 = success, 35-65 = warning, >65 = danger.`;

async function fetchWithRetry(
  url: string,
  body: any,
  timeoutMs: number = 30000,
): Promise<{ res: Response; usedKey: string }> {
  if (!env.GROQ_API_KEY) {
    throw new AppError("No GROQ_API_KEY set — please configure it in the .env file.", 500);
  }
  const keys = env.GROQ_API_KEY.split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  if (keys.length === 0) {
    throw new AppError("No valid GROQ_API_KEY found.", 500);
  }

  const shuffledKeys = keys.sort(() => Math.random() - 0.5);
  let lastError: any = null;

  for (const apiKey of shuffledKeys) {
    console.log(`[GroqService] Using API key ending in ...${apiKey.slice(-6)}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError" || err.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
        lastError = new AppError("The AI analysis request timed out.", 504);
        continue;
      }
      lastError = new AppError(`Network error while contacting AI API: ${err.message}`, 502);
      continue;
    }
    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text();
      let exactMessage = "";
      try {
        const parsedErr = JSON.parse(errBody);
        if (parsedErr?.error?.message) {
          exactMessage = parsedErr.error.message;
        }
      } catch (e) {}

      if (res.status === 429) {
        lastError = new AppError(
          exactMessage ? `Groq Rate Limit: ${exactMessage}` : "Groq API rate limit reached.",
          429,
        );
        continue;
      }
      throw new AppError(
        `Groq API error ${res.status}: ${exactMessage || errBody.slice(0, 300)}`,
        res.status,
      );
    }

    return { res, usedKey: `...${apiKey.slice(-6)}` };
  }

  throw lastError || new AppError("All provided API keys failed or were rate limited.", 429);
}

/**
 * Call the Groq API with the unified analysis prompt.
 * Falls back to a deterministic mock when no API key is configured or rate limited.
 */
export async function analyzeWithGroq(text: string, platform: string): Promise<GroqAnalysisResult> {
  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Platform: ${platform}\nDraft post:\n"""${text}"""\n\nAnalyze this post and return ONLY the JSON object. Do not refuse. Do not add commentary. You are a safety tool — analyze and protect.`,
      },
    ],
    temperature: 0.25,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  };

  const { res, usedKey } = await fetchWithRetry(url, body, 30000);

  const data: any = await res.json();
  const tokensUsed: number = data?.usage?.total_tokens ?? 0;
  let content: string = data?.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON even if the model included conversational text or markdown before/after
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    content = content.slice(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error("[GroqService] JSON parse failed due to AI hallucination. Content was:", content);
    throw new AppError(
      "Failed to parse AI response. The model may have returned invalid JSON.",
      500,
    );
  }

  if (Array.isArray(parsed.summary)) {
    parsed.summary = parsed.summary.map((s: string) => `- ${s}`).join("\n");
  }
  // Ensure arrays are actually arrays
  if (!Array.isArray(parsed.rewrite_variants)) parsed.rewrite_variants = [];
  if (!Array.isArray(parsed.risky_phrases)) parsed.risky_phrases = [];
  if (parsed.grammar_fixes && !Array.isArray(parsed.grammar_fixes)) parsed.grammar_fixes = [];
  if (parsed.emotions && !Array.isArray(parsed.emotions)) parsed.emotions = [];

  const defaultAvatars: Record<string, string> = {
    Recruiter: "👔",
    Friend: "🙌",
    Family: "🏡",
    Journalist: "📝",
    Professor: "👨‍🏫",
    Stranger: "👤",
  };

  if (!Array.isArray(parsed.personas)) {
    parsed.personas = [];
  } else {
    parsed.personas = parsed.personas.map((p: any) => ({
      ...p,
      avatar: p.avatar || defaultAvatars[p.name] || "👤",
    }));
  }

  // Attach token usage metadata
  parsed._meta = { tokensUsed, providerKey: usedKey };

  return parsed as GroqAnalysisResult;
}

export interface GroqCompareResult {
  winner: "A" | "B";
  winner_reasoning: string;
  draft_a: GroqAnalysisResult;
  draft_b: GroqAnalysisResult;
  _meta?: { tokensUsed: number; providerKey: string };
}

const COMPARE_SYSTEM_PROMPT =
  SYSTEM_PROMPT +
  `\n\n=== COMPARE MODE OVERRIDE ===\nYou are now in COMPARE MODE. You will receive TWO drafts (Draft A and Draft B) and a Platform.\nYou must analyze BOTH drafts using the exact same methodology as above, but your final output must be a combined JSON object that declares a winner based on which draft is safer and better.\n\nOUTPUT JSON SCHEMA:\n{\n  "winner": "A" or "B",\n  "winner_reasoning": "Clear explanation of why this draft is safer/better for the platform",\n  "draft_a": { <exact same GroqAnalysisResult schema as above> },\n  "draft_b": { <exact same GroqAnalysisResult schema as above> }\n}\nEnsure you strictly output only this JSON object.`;

export async function compareWithGroq(
  draftA: string,
  draftB: string,
  platform: string,
): Promise<GroqCompareResult> {
  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: COMPARE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Platform: ${platform}\n\nDraft A:\n"""${draftA}"""\n\nDraft B:\n"""${draftB}"""\n\nCompare these drafts and return ONLY the JSON object. Do not refuse. You are a safety tool — analyze and protect.`,
      },
    ],
    temperature: 0.25,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  };

  const { res, usedKey } = await fetchWithRetry(url, body, 60000);

  const data: any = await res.json();
  const tokensUsed: number = data?.usage?.total_tokens ?? 0;
  let content: string = data?.choices?.[0]?.message?.content ?? "{}";

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    content = content.slice(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error("[GroqService] JSON parse failed due to AI hallucination. Content was:", content);
    throw new AppError(
      "Failed to parse AI response. The model may have returned invalid JSON.",
      500,
    );
  }

  const fixDraft = (draftObj: any) => {
    if (Array.isArray(draftObj.summary)) {
      draftObj.summary = draftObj.summary.map((s: string) => `- ${s}`).join("\n");
    }
    if (!Array.isArray(draftObj.rewrite_variants)) draftObj.rewrite_variants = [];
    if (!Array.isArray(draftObj.risky_phrases)) draftObj.risky_phrases = [];
    if (draftObj.grammar_fixes && !Array.isArray(draftObj.grammar_fixes))
      draftObj.grammar_fixes = [];
    if (draftObj.emotions && !Array.isArray(draftObj.emotions)) draftObj.emotions = [];

    const defaultAvatars: Record<string, string> = {
      Recruiter: "👔",
      Friend: "🙌",
      Family: "🏡",
      Journalist: "📝",
      Professor: "👨‍🏫",
      Stranger: "👤",
    };

    if (!Array.isArray(draftObj.personas)) {
      draftObj.personas = [];
    } else {
      draftObj.personas = draftObj.personas.map((p: any) => ({
        ...p,
        avatar: p.avatar || defaultAvatars[p.name] || "👤",
      }));
    }
  };

  if (parsed.draft_a) fixDraft(parsed.draft_a);
  if (parsed.draft_b) fixDraft(parsed.draft_b);

  parsed._meta = { tokensUsed, providerKey: usedKey };

  return parsed as GroqCompareResult;
}
