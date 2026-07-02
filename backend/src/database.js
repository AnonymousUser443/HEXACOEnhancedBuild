const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'personality.db');

let db = null;

function getDb() {
  if (!db) throw new Error('数据库未初始化，请先调用 initDb()');
  return db;
}

async function initDb() {
  const SQL = await initSqlJs();

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 如果已有数据库文件，加载它
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  // 建表
  db.run(`
    CREATE TABLE IF NOT EXISTS dimensions (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS facets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dimension_code TEXT NOT NULL REFERENCES dimensions(code),
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facet_id INTEGER NOT NULL REFERENCES facets(id),
      stem TEXT NOT NULL,
      reverse_scored INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      question_id INTEGER NOT NULL REFERENCES questions(id),
      answer_value INTEGER NOT NULL CHECK (answer_value BETWEEN 1 AND 5),
      response_time_ms INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(session_id, question_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sjt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      question_id TEXT NOT NULL,
      answer_value TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(session_id, question_id)
    )
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = { getDb, initDb, saveDb };
