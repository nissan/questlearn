import { MEME_TEMPLATES } from './meme-templates'
import { pickMemeTemplate } from './pick-meme-template'

/** Compact template list for the prompt — id|name|tags */
function buildTemplateList(): string {
  return MEME_TEMPLATES.map(
    (t) => `${t.id}|${t.name}|${t.tags.join(',')}`
  ).join('\n')
}

/** Extract TOP/BOTTOM from a CurricuLLM body string (fallback) */
function extractMemeText(body: string): { topText: string; bottomText: string } {
  const topMatch = body.match(/^TOP:\s*(.+)/im)
  const bottomMatch = body.match(/^BOTTOM:\s*(.+)/im)
  return {
    topText: topMatch?.[1]?.trim() ?? 'Did you know...',
    bottomText: bottomMatch?.[1]?.trim() ?? '...it was actually this simple.',
  }
}

export async function generateMemeWithTemplate(
  topic: string,
  curriculumFact: string,
): Promise<{ templateId: string; topText: string; bottomText: string }> {
  const apiKey = process.env.CURRICULLM_API_KEY ?? process.env.OPENAI_API_KEY

  if (!apiKey) {
    // No key — fall back immediately
    const fallbackTemplate = pickMemeTemplate(topic, curriculumFact, '')
    const { topText, bottomText } = extractMemeText(curriculumFact)
    return { templateId: fallbackTemplate.id, topText, bottomText }
  }

  const templateList = buildTemplateList()

  const systemPrompt = `You are a comedy writer for Australian high school students (Years 8–10). You write memes that are genuinely funny to 14-year-olds — relatable, witty, uses internet humor. NOT corny or trying-too-hard. You also pick the best meme template for the content.`

  const userPrompt = `Topic: ${topic}
Curriculum content: ${curriculumFact}

Available meme templates (id|name|tags):
${templateList}

Generate a FUNNY meme caption for this topic.

Style: Relatable, witty, uses internet humor. NOT corny or trying-too-hard.

Constraints:
- Top text: 3–5 words max
- Bottom text: 4–8 words max
- Use relatable student experiences (tests, homework, confusion, expectations vs reality)
- Include Australian slang/references where it fits naturally
- Avoid explaining the science — just be funny
- Use popular meme formats that are still current

Examples of GOOD memes (style to match):
- Photosynthesis: "Me trying to understand photosynthesis" / "My brain during the test"
- Gravity: "When teacher explains gravity" / "Me still confused"
- French verbs: "Me conjugating French verbs" / "It not making sense"
- Newton's Laws: "Objects in motion stay in motion" / "Me after recess ends"

Your job:
1. Pick the single best meme template from the list above that fits this topic
2. Write TOP text (3–5 words, setup/question)
3. Write BOTTOM text (4–8 words, punchline — make it land!)

Return ONLY valid JSON (no markdown, no extra text):
{"templateId": "...", "topText": "...", "bottomText": "..."}`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 200,
      }),
    })

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() ?? ''

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(cleaned) as { templateId: string; topText: string; bottomText: string }

    // Validate the templateId exists in our library
    const validTemplate = MEME_TEMPLATES.find((t) => t.id === parsed.templateId)
    if (!validTemplate) {
      // LLM hallucinated a templateId — fall back to keyword match
      const fallback = pickMemeTemplate(topic, parsed.topText ?? '', parsed.bottomText ?? '')
      return {
        templateId: fallback.id,
        topText: parsed.topText ?? '',
        bottomText: parsed.bottomText ?? '',
      }
    }

    return {
      templateId: parsed.templateId,
      topText: parsed.topText,
      bottomText: parsed.bottomText,
    }
  } catch (err) {
    console.error('[meme-humour] LLM error, falling back:', err)
    const fallbackTemplate = pickMemeTemplate(topic, curriculumFact, '')
    const { topText, bottomText } = extractMemeText(curriculumFact)
    return { templateId: fallbackTemplate.id, topText, bottomText }
  }
}
