export interface CurricuLLMResponse {
  title: string;
  body: string;
  socraticPrompt: string;
  curriculumRef: string;
  _stub: boolean;
}

export interface SocraticFollowUpResponse {
  followUp: string;
  _stub: boolean;
}

const SOCRATIC_FOLLOWUPS = [
  "Interesting — you mentioned energy. Can you be more specific about what form that energy takes, and how it gets stored?",
  "You're on the right track. Now think about it from the subject's perspective: why would it need this process? What does it actually use it for?",
  "Good thinking. One more push: what would happen to everything that depends on this if the process stopped? Walk me through the chain of effects.",
];

export function generateStubContent(topic: string, format: string): CurricuLLMResponse {
  const stubs: Record<string, CurricuLLMResponse> = {
    story: {
      title: `The Hidden Story of ${topic}`,
      body: `You step into the lab, armed with a question your teacher couldn't fully answer about ${topic}. The air is thick with possibility. Dr Patel points to the equipment in the corner. "Everything you think you know is about to get a lot more interesting," she says quietly.\n\nOutside, through the glass, the Sydney skyline glitters. But in here, you're about to discover something that changes how you see the world. What exactly is happening? What are the forces at play? And why does it matter at all?`,
      socraticPrompt: `If you had to explain ${topic} to a 10-year-old using only a simple analogy, what would you say? What's the core idea you'd try to convey?`,
      curriculumRef: 'AC9S9U01',
      _stub: true,
    },
    game: {
      title: `Operation: ${topic}`,
      body: `MISSION BRIEFING: A critical system has failed. You must diagnose the problem.\n\nSCENARIO: You enter the operations bay. Three systems show different states:\n- System A: Fully operational ✅\n- System B: Partially degraded ⚠️\n- System C: Critical failure ❌\n\nDr Chen asks: "What principle of ${topic} explains why System C failed?"\n\n👉 A) The fundamental process broke down\n👉 B) External interference disrupted the system\n👉 C) A resource ran out\n\n[SELECT YOUR ANSWER TO CONTINUE THE MISSION]`,
      socraticPrompt: `You made a choice — but WHY is that the right answer? What underlying principle of ${topic} explains it?`,
      curriculumRef: 'AC9S9U01',
      _stub: true,
    },
    meme: {
      title: `The ${topic} Reality Check`,
      body: `TOP TEXT: "When someone says they already understand ${topic}"\nBOTTOM TEXT: "The actual concept: hold my beaker"\n\n[IMAGE DESCRIPTOR: Drake meme format — Drake rejecting oversimplified explanation, Drake approving the nuanced version.]\n\nCAPTION: Here's the thing about ${topic} — the surface explanation sounds simple. But once you dig in, there's a whole hidden layer that makes everything click. That's the part worth understanding.`,
      socraticPrompt: `The meme hints there's a "hidden layer" to ${topic}. What do you think that deeper layer might be? What's the part most people miss?`,
      curriculumRef: 'AC9S9U01',
      _stub: true,
    },
    puzzle: {
      title: `The ${topic} Puzzle`,
      body: `DECODE THE CONCEPT:\n\nUnscramble the key components of ${topic} by placing these elements in the correct relationship:\n\n🧩 Pieces: [Input] [Process] [Output] [Conditions] [Result]\n\nThe structure is:\n___ → ___ (under ___ conditions) → ___ producing ___\n\nHint 1: Something goes in and something comes out — what are they?\nHint 2: The conditions matter — what environment makes this work?\nHint 3: The output isn't always what you'd first expect.\n\n[ARRANGE THE PIECES — or describe the relationship in your own words]`,
      socraticPrompt: `You've mapped the pieces — now tell me in your own words: what is actually HAPPENING in ${topic}? What's the point of the whole process?`,
      curriculumRef: 'AC9S9U01',
      _stub: true,
    },
    short_film: {
      title: `Inside ${topic} — A Micro Journey`,
      body: `SCENE 1 — EXT. THE SYSTEM — DAY\nWe zoom in, past the surface, into the heart of where ${topic} happens.\n\nSCENE 2 — INT. THE PROCESS — CONTINUOUS\nNARRATOR (V.O.): "This is where it all begins. The conditions align and something remarkable happens..."\n\nSCENE 3 — INT. THE REACTION — MOMENTS LATER\nThe inputs arrive. The process begins.\nNARRATOR (V.O.): "Two things combine. One principle governs everything."\nThe output emerges — unexpected, essential.\n\nSCENE 4 — EXT. THE WORLD — CONTINUOUS\nNARRATOR (V.O.): "And everything that follows began right here."\nFADE OUT.`,
      socraticPrompt: `The film shows an output emerging. Why is that output significant? What would be different about the world if ${topic} didn't produce it?`,
      curriculumRef: 'AC9S9U01',
      _stub: true,
    },
  };
  return stubs[format] ?? stubs.story;
}

export function generateStubSocratic(turnIndex: number): SocraticFollowUpResponse {
  return {
    followUp: SOCRATIC_FOLLOWUPS[turnIndex % SOCRATIC_FOLLOWUPS.length],
    _stub: true,
  };
}
