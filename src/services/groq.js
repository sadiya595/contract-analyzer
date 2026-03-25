import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeContract(text) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert legal contract analyst. Analyze contract text and identify all notable clauses. For each clause return a JSON object with exactly these fields:
- "title": short name for the clause
- "category": one of: "IP", "Liability", "Termination", "Payment", "Confidentiality", "Non-Compete", "Other"
- "risk_level": one of: "high", "medium", "low"
- "original_text": exact excerpt from contract (max 300 characters)
- "plain_english": what this clause means in simple language (2-3 sentences)
- "recommended_action": one specific thing to do or watch out for (1 sentence)

Return ONLY a valid JSON array. No markdown, no backticks, no explanation. Raw JSON array only.`,
      },
      {
        role: "user",
        content: `Analyze this contract:\n\n${text}`,
      },
    ],
    temperature: 0.2,
  });

  const rawText = completion.choices[0].message.content;
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  const clauses = JSON.parse(cleaned);
  return clauses;
}