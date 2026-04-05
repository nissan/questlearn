export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS ql_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    onboarding_complete INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT
  )`,
`CREATE TABLE IF NOT EXISTS ql_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES ql_users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS learning_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    format TEXT NOT NULL,
    turn_count INTEGER NOT NULL DEFAULT 0,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_active_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES ql_users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS engagement_events (
    id TEXT PRIMARY KEY,
    learning_session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    turn_index INTEGER NOT NULL,
    student_response TEXT,
    ai_followup TEXT,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_session_id) REFERENCES learning_sessions(id),
    FOREIGN KEY (user_id) REFERENCES ql_users(id)
  )`,
`CREATE INDEX IF NOT EXISTS idx_learning_user ON learning_sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_events_session ON engagement_events(learning_session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_events_user ON engagement_events(user_id)`,
  // Content cache — reuse generated content for same topic+format combos
  `CREATE TABLE IF NOT EXISTS content_cache (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    format TEXT NOT NULL,
    variant INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    socratic_prompt TEXT NOT NULL,
    curriculum_ref TEXT NOT NULL,
    use_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_used_at TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_cache_topic_format ON content_cache(topic, format)`,
  // Lumina OS — OS-native registration (separate from email-based ql_users)
  `CREATE TABLE IF NOT EXISTS lumina_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    school_name TEXT,
    school_location TEXT,
    year_level TEXT,
    teacher_id TEXT,
    subject TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];
