export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    onboarding_complete INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS otc_tokens (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_sent_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS learning_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    format TEXT NOT NULL,
    turn_count INTEGER NOT NULL DEFAULT 0,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_active_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS engagement_events (
    id TEXT PRIMARY KEY,
    learning_session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    turn_index INTEGER NOT NULL,
    student_response TEXT,
    ai_followup TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (learning_session_id) REFERENCES learning_sessions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_otc_email ON otc_tokens(email)`,
  `CREATE INDEX IF NOT EXISTS idx_learning_user ON learning_sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_events_session ON engagement_events(learning_session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_events_user ON engagement_events(user_id)`,
];
