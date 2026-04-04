import { MEME_TEMPLATES, MemeTemplate } from './meme-templates'

/**
 * Simple seeded pseudo-random number generator (mulberry32).
 * Returns a float in [0, 1) for a given seed.
 */
function seededRandom(seed: number): () => number {
  let s = seed
  return function () {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash a string to a stable integer seed. */
function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}

/**
 * Pick the best-matching meme template for the given topic and text.
 * Scores by tag overlap, breaks ties/no-match with a seeded-random pick
 * from the top 20 so the same topic always gets the same template.
 */
export function pickMemeTemplate(
  topic: string,
  topText: string,
  bottomText: string
): MemeTemplate {
  const combined = `${topic} ${topText} ${bottomText}`.toLowerCase()

  // Score each template
  const scored = MEME_TEMPLATES.map((t) => {
    const score = t.tags.filter((tag) => combined.includes(tag)).length
    return { template: t, score }
  })

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  const topScore = scored[0].score

  if (topScore > 0) {
    // Collect all templates tied at the top score
    const tied = scored.filter((s) => s.score === topScore)
    if (tied.length === 1) return tied[0].template

    // Break ties with seeded random
    const rand = seededRandom(hashString(topic.toLowerCase()))
    const idx = Math.floor(rand() * tied.length)
    return tied[idx].template
  }

  // No match — pick seeded-random from top 20
  const top20 = scored.slice(0, 20).map((s) => s.template)
  const rand = seededRandom(hashString(topic.toLowerCase()))
  const idx = Math.floor(rand() * top20.length)
  return top20[idx]
}
