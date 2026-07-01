/**
 * sql.js 便捷查询辅助函数
 * 将 sql.js 的原生 API 封装为更简洁的调用方式
 */
const { getDb, saveDb } = require('./database');

function run(sql, params = []) {
  const db = getDb();
  db.run(sql, params);
  saveDb();
}

function get(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

function all(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

module.exports = { run, get, all };
