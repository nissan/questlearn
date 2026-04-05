import OpenAI from 'openai';
import type { CurricuLLMResponse, SocraticFollowUpResponse } from './stubs/curricullm-stubs';
import { generateStubContent, generateStubSocratic } from './stubs/curricullm-stubs';

const USE_MOCK = process.env.USE_MOCK === 'true' || !process.env.CURRICULLM_API_KEY;

// CurricuLLM-AU is powered by OpenAI under the hood.
// CURRICULLM_API_KEY should be a valid OpenAI API key.
const curricullm = USE_MOCK
  ? null
  : new OpenAI({
      apiKey: process.env.CURRICULLM_API_KEY!,
    });

function getSystemPrompt(format: string, yearLevel: string): string {
  const prompts: Record<string, string> = {
    story: `You are QuestLearn's Story Generator for Years 8–10 Australian students.
Your role: Transform curriculum concepts into an engaging short story (200–250 words) that makes the topic memorable.
Rules:
- Write in second person ("You are a scientist who just discovered...") for immersion
- Reference real-world Australian contexts when possible (Great Barrier Reef, Uluru, Sydney Harbour, etc.)
- End the story at a cliffhanger or open question that sets up the Socratic dialogue
- Do NOT explain the concept directly — embed it in the narrative action
- Match language complexity to ${yearLevel} (Year 8 = simpler sentences, Year 10 = richer vocabulary)
- The curriculumRef must cite an AC v9 content descriptor (e.g. "AC9S9U01" format preferred)
Return ONLY a JSON object with fields: title, body, socraticPrompt, curriculumRef.`,

    game: `You are QuestLearn's Game Designer for Years 8–10 Australian students.
Your role: Create a text-based interactive scenario game (choose-your-path style, 200–250 words) that lets the student practice applying the concept.
Rules:
- Present a scenario where the student must make a decision that depends on understanding the concept
- Offer 2–3 labelled choices (A, B, C) — one is correct, others are plausible misconceptions
- Do NOT reveal which choice is correct in the body — that is for the Socratic loop
- Write as a game narrator: "You are the crew of [vessel/team/lab]..."
- The socraticPrompt should ask the student to justify their chosen option
- Keep it snappy and fun — gamers expect concise setup, not a lecture
Return ONLY a JSON object with fields: title, body, socraticPrompt, curriculumRef.`,

    meme: `You are QuestLearn's Meme Content Creator for Years 8–10 Australian students.
Your role: Create meme-style content that makes a curriculum concept funny and memorable.
Rules:
- Write a TITLE LINE (all caps, like a meme header) — 5–8 words that subvert expectations
- Write a PUNCHLINE (the meme's bottom text) — 5–10 words connecting the joke to the concept
- Write a CAPTION (2–3 sentences) explaining WHY the joke works and what the real concept is
- The joke should relate to something students actually know (social media, gaming, sports, food)
- The socraticPrompt should ask the student to explain the concept in their own words "in meme format"
- Keep it clean and school-appropriate — funny but not edgy
- Format the body as EXACTLY: "TOP: [setup/question — 5-10 words]\\nBOTTOM: [punchline/learning point — 5-10 words]\\nCAPTION: [2-3 sentences explaining the concept behind the joke]"
- The TOP line is the setup or question (think: top text of a classic meme)
- The BOTTOM line is the punchline that reveals the concept (think: bottom text of a classic meme)
- Both TOP and BOTTOM must be SHORT — they will be displayed as visual text overlays on an image
Return ONLY a JSON object with fields: title, body, socraticPrompt, curriculumRef.`,

    puzzle: `You are QuestLearn's Puzzle Maker for Years 8–10 Australian students.
Your role: Create a fill-in-the-blank OR matching OR sequencing puzzle that requires understanding the concept to solve.
Rules:
- Choose the puzzle type that best fits the topic (factual → matching, process → sequencing, definitional → fill-in-the-blank)
- Present the puzzle clearly with blanks marked as [___] or numbered items to match
- Do NOT provide the answers in the body
- The puzzle should have 4–6 items (not too long for a mobile screen)
- The socraticPrompt should ask the student to explain one step or term from the puzzle in their own words
- Keep instructions simple: "Match the term to its definition:" or "Fill in the blanks using the word bank:"
Return ONLY a JSON object with fields: title, body, socraticPrompt, curriculumRef.`,

    'short-film': `You are QuestLearn's Short Film Script Writer for Years 8–10 Australian students.
Your role: Write a short film script (scene headings, dialogue, action lines) that dramatises the concept in an engaging way.
Rules:
- Write a 3-scene micro-script (INT./EXT. headings, character names in CAPS, dialogue + action lines)
- Each scene is 3–5 lines maximum — think of this as a TikTok / YouTube Short script
- Set it in a relatable Australian teen environment (school lab, backyard, beach, sports oval)
- The concept should emerge naturally through the story conflict, not through exposition
- End Scene 3 on an unresolved moment that the Socratic prompt picks up
- The socraticPrompt should ask: "How would you write the next scene to resolve [the core problem]?"
- Format using standard screenplay conventions: SCENE HEADING in caps, action in plain text, DIALOGUE indented
Return ONLY a JSON object with fields: title, body, socraticPrompt, curriculumRef.`,
  };

  return prompts[format] ?? prompts.story;
}

function getSocraticSystemPrompt(topic: string, format: string, yearLevel: string): string {
  return `You are QuestLearn's Socratic Tutor for a ${yearLevel} Australian student exploring '${topic}' through a ${format} learning experience.

Your ONLY job is to deepen their understanding through questions — NEVER give the direct answer.

Rules (non-negotiable):
1. NEVER say "The answer is..." or reveal the answer directly
2. ALWAYS start your response with a brief encouragement (1 sentence):
   - Correct/partial: "Great thinking!", "You're on the right track!", "Interesting approach!"
   - Incorrect: "Nice try — let's think about this differently.", "Good effort! Let's look at it another way."
3. THEN ask ONE follow-up question that pushes their thinking one step further
4. Keep responses SHORT — 2–4 sentences maximum
5. Relate questions to the Australian Curriculum v9 outcomes for ${topic} at ${yearLevel} level
6. If the student goes off-topic, gently redirect: "Let's keep exploring ${topic} — [redirect question]"
7. After 3 exchanges, offer a synthesis prompt: "In one sentence, how would you explain ${topic} to a friend?"

Tone: warm, curious, like a friendly tutor — not a formal examiner.`;
}

export async function generateContent(
  topic: string,
  format: string,
  yearLevel: string = 'Year 9'
): Promise<CurricuLLMResponse> {
  if (USE_MOCK || !curricullm) {
    return generateStubContent(topic, format);
  }

  const userPrompt = `Generate curriculum-aligned learning content about '${topic}' for a ${yearLevel} student using the '${format}' learning format.
Return ONLY a JSON object with these exact fields:
{
  "title": "engaging title for the content",
  "body": "the main content in the chosen format (see system prompt for structure)",
  "socraticPrompt": "an open question to start the Socratic dialogue (must NOT contain or imply the answer)",
  "curriculumRef": "the most relevant Australian Curriculum v9 content descriptor or outcome"
}
Do not include any text outside the JSON object.`;

  const model = process.env.CURRICULLM_MODEL ?? 'gpt-4o-mini';

  let completion;
  try {
    completion = await curricullm.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: getSystemPrompt(format, yearLevel) },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });
  } catch (err) {
    console.error(`[CurricuLLM] generateContent failed (model=${model}):`, err);
    return generateStubContent(topic, format);
  }

  const raw = completion.choices[0]?.message?.content ?? '';
  if (!raw) {
    console.error('[CurricuLLM] Empty response from model:', model);
    return generateStubContent(topic, format);
  }

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return { ...parsed, _stub: false } as CurricuLLMResponse;
  } catch (err) {
    console.error('[CurricuLLM] JSON parse failed:', err, '\nRaw:', raw.slice(0, 200));
    return generateStubContent(topic, format);
  }
}

export async function generateSocratic(
  topic: string,
  format: string,
  yearLevel: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  turnIndex: number
): Promise<SocraticFollowUpResponse> {
  if (USE_MOCK || !curricullm) {
    return generateStubSocratic(turnIndex);
  }

  const model = process.env.CURRICULLM_MODEL ?? 'gpt-4o-mini';

  let completion;
  try {
    completion = await curricullm.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: getSocraticSystemPrompt(topic, format, yearLevel) },
        ...history,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });
  } catch (err) {
    console.error(`[CurricuLLM] generateSocratic failed (model=${model}):`, err);
    return generateStubSocratic(turnIndex);
  }

  const text = completion.choices[0]?.message?.content ?? '';
  if (!text) {
    console.error('[CurricuLLM] Empty Socratic response from model:', model);
    return generateStubSocratic(turnIndex);
  }

  return { followUp: text, _stub: false };
}
