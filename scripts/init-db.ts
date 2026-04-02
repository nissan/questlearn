import { getDb } from '../src/lib/db';
import { SCHEMA_SQL } from '../src/lib/schema';

async function initDb() {
  const db = getDb();
  console.log('Initialising QuestLearn database schema...');
  for (const sql of SCHEMA_SQL) {
    await db.execute(sql);
    console.log('✅', sql.split('\n')[0].trim());
  }
  console.log('\n✅ Database schema initialised successfully');
}

initDb().catch(console.error);
