import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const SUBJECT_TOPICS: Record<string, string[]> = {
  Mathematics: ['Algebra', 'Geometry', 'Statistics & Probability', 'Number & Algebra', 'Measurement'],
  Science: ['Photosynthesis', 'Cell Biology', 'Forces & Motion', 'Chemical Reactions', 'Ecosystems', 'Genetics'],
  English: ['Creative Writing', 'Poetry Analysis', 'Persuasive Texts', 'Shakespeare', 'Media Literacy'],
  History: ['Ancient Civilisations', 'World War II', 'Australian History', 'The Cold War', 'Indigenous History'],
  Geography: ['Climate Change', 'Urbanisation', 'Plate Tectonics', 'Water Cycles', 'Biomes'],
  Technology: ['Algorithms', 'Data & Privacy', 'Artificial Intelligence', 'Networks', 'Cybersecurity'],
};

export async function GET() {
  try {
    const db = getDb();

    const result = await db.execute(`
      SELECT topic, COUNT(DISTINCT user_id) as student_count
      FROM learning_sessions
      GROUP BY topic
    `);

    // Build a lookup map from DB results
    const countMap = new Map<string, number>();
    for (const row of result.rows) {
      countMap.set(row.topic as string, Number(row.student_count ?? 0));
    }

    const subjects = Object.entries(SUBJECT_TOPICS).map(([subject, topics]) => ({
      subject,
      topics: topics.map((topic) => ({
        topic,
        student_count: countMap.get(topic) ?? 0,
      })),
    }));

    return NextResponse.json({ subjects });
  } catch (err) {
    console.error('[by-subject] error:', err);
    // Return static data with 0 counts on error
    const subjects = Object.entries(SUBJECT_TOPICS).map(([subject, topics]) => ({
      subject,
      topics: topics.map((topic) => ({ topic, student_count: 0 })),
    }));
    return NextResponse.json({ subjects });
  }
}
