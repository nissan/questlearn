export const FORMATS = [
  // Primary formats — always visible, no scroll needed
  { id: 'meme',       label: 'Meme',       icon: '😂', description: 'Remember it through humour', tier: 'primary' as const },
  { id: 'flashcards',   label: 'Flashcards',   icon: '🃏', description: 'Test your recall with AI-powered flashcards', tier: 'primary' as const },
  { id: 'concept_map',  label: 'Concept Map',  icon: '🗺️', description: 'Build visual connections between ideas with AI feedback', tier: 'primary' as const },
  { id: 'debate',       label: 'Debate',       icon: '⚖️', description: 'Argue your point against an AI opponent', tier: 'primary' as const },
  // Secondary formats — smaller, with "Coming Soon" badge
  { id: 'game',       label: 'Game',       icon: '🎮', description: 'Learn by playing a scenario', tier: 'secondary' as const },
  { id: 'story',      label: 'Story',      icon: '📖', description: 'Explore through a short story', tier: 'secondary' as const },
  { id: 'puzzle',     label: 'Puzzle',     icon: '🧩', description: 'Solve your way to understanding', tier: 'secondary' as const },
  { id: 'short_film', label: 'Short Film', icon: '🎬', description: 'Watch a cinematic micro-scene', tier: 'secondary' as const },
] as const;

export type FormatId = typeof FORMATS[number]['id'];
export type FormatTier = 'primary' | 'secondary';
