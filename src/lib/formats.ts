export const FORMATS = [
  { id: 'game',       label: 'Game',       icon: '🎮', description: 'Learn by playing a scenario' },
  { id: 'story',      label: 'Story',      icon: '📖', description: 'Explore through a short story' },
  { id: 'meme',       label: 'Meme',       icon: '😂', description: 'Remember it through humour' },
  { id: 'puzzle',     label: 'Puzzle',     icon: '🧩', description: 'Solve your way to understanding' },
  { id: 'short_film', label: 'Short Film', icon: '🎬', description: 'Watch a cinematic micro-scene' },
  { id: 'flashcards',   label: 'Flashcards',   icon: '🃏', description: 'Test your recall with AI-powered flashcards' },
  { id: 'concept_map',  label: 'Concept Map',  icon: '🗺️', description: 'Build visual connections between ideas with AI feedback' },
] as const;

export type FormatId = typeof FORMATS[number]['id'];
