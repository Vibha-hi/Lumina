# How to Train LUMINA.AI for Better Accuracy

You don't actually "train" the API key itself — the key just acts as a password to access Google's massive AI brain. Instead, you train the AI on how to behave for your specific app by changing what you send it.

Here are the 3 best ways to make the AI more accurate for LUMINA, from easiest to most advanced:

---

### Level 1: Add a "Scoring Rubric" (Easiest)

Right now, the AI guesses what "professional risk" means. You can make it highly accurate by opening `backend/src/services/GeminiService.ts` and adding a strict grading rubric to the `SYSTEM_PROMPT`.

**Example to add to SYSTEM_PROMPT:**

```text
RISK SCORING RUBRIC:
- Privacy Risk (0-30): Mentioning a generic city or state.
- Privacy Risk (70-100): Mentioning exact addresses, phone numbers, full names of non-public figures, or employer names combined with complaints.
- Professional Risk (70-100): Profanity, complaining about a boss/coworker, controversial political stances, or admitting to illegal/unethical acts.
- Misunderstanding Risk (80-100): Heavy sarcasm without a tone indicator, inside jokes, or highly polarizing statements out of context.
```

_Why this works: The AI stops guessing and starts matching the text against your strict rules._

---

### Level 2: Few-Shot Prompting (Highly Recommended)

AI learns best by seeing examples. You can literally paste 2 or 3 examples of "perfect" analyses directly into the `SYSTEM_PROMPT` in `GeminiService.ts`. The AI will copy your exact logic.

**Example to add to SYSTEM_PROMPT:**

```text
EXAMPLE 1:
Post: "My boss is such an idiot, I can't wait to quit this stupid marketing job at TechCorp."
Platform: LinkedIn
Expected Output: {
  "overall_risk": 95,
  "privacy_risk": 80,
  "professional_risk": 100,
  "personas": [{"name": "Recruiter", "risk": 100, "comment": "I would instantly reject this candidate.", "tone": "danger"}]
}
```

_Why this works: The AI sees how harsh you want it to be and mimics your exact scoring style._

---

### Level 3: Google AI Studio System Instructions (Advanced)

If you want to test how the AI responds _before_ writing code:

1. Go back to [aistudio.google.com](https://aistudio.google.com)
2. Click **Create New Prompt** -> **System Instructions**
3. Paste the entire `SYSTEM_PROMPT` from `GeminiService.ts` into the System Instructions box.
4. On the right side, type fake posts and see what the AI outputs.
5. If it gets a score wrong, tweak the System Instructions until it's perfect, then copy those instructions back into your `GeminiService.ts` file!
