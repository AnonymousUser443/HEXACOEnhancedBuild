const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../dbhelper');

const router = express.Router();

// 创建新会话（匿名用户）
router.post('/', (req, res) => {
  const userId = uuidv4();
  const sessionId = uuidv4();

  run('INSERT INTO users (id) VALUES (?)', [userId]);
  run('INSERT INTO sessions (id, user_id) VALUES (?, ?)', [sessionId, userId]);

  res.status(201).json({ sessionId, userId });
});

// 提交答案
router.post('/:sessionId/answers', (req, res) => {
  const { sessionId } = req.params;
  const { questionId, answerValue, responseTimeMs } = req.body;

  // 验证会话状态
  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });

  // 验证题目存在
  const question = get('SELECT id FROM questions WHERE id = ?', [questionId]);
  if (!question) return res.status(404).json({ error: '题目不存在' });

  // 验证分值范围
  if (answerValue < 1 || answerValue > 5) {
    return res.status(400).json({ error: '分值必须在 1-5 之间' });
  }

  // 保存答案（若已存在则覆盖）
  const existing = get(
    'SELECT id FROM answers WHERE session_id = ? AND question_id = ?',
    [sessionId, questionId]
  );

  if (existing) {
    run(
      'UPDATE answers SET answer_value = ?, response_time_ms = ? WHERE session_id = ? AND question_id = ?',
      [answerValue, responseTimeMs || 0, sessionId, questionId]
    );
  } else {
    run(
      'INSERT INTO answers (session_id, question_id, answer_value, response_time_ms) VALUES (?, ?, ?, ?)',
      [sessionId, questionId, answerValue, responseTimeMs || 0]
    );
  }

  res.json({ success: true });
});

// 获取会话进度
router.get('/:sessionId/progress', (req, res) => {
  const { sessionId } = req.params;

  const total = get('SELECT COUNT(*) as cnt FROM questions');
  const answered = get(
    'SELECT COUNT(*) as cnt FROM answers WHERE session_id = ?',
    [sessionId]
  );

  res.json({
    total: total.cnt,
    answered: answered.cnt,
    percent: total.cnt > 0 ? Math.round((answered.cnt / total.cnt) * 100) : 0
  });
});

// 完成会话
router.post('/:sessionId/complete', (req, res) => {
  const { sessionId } = req.params;

  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });

  run(
    "UPDATE sessions SET status = 'completed', completed_at = datetime('now') WHERE id = ?",
    [sessionId]
  );

  res.json({ success: true });
});

// 获取会话计算结果（HEXACO 维度分数）
router.get('/:sessionId/result', (req, res) => {
  const { sessionId } = req.params;

  const answers = all(`
    SELECT a.answer_value, q.reverse_scored, q.facet_id,
           f.dimension_code, f.name as facet_name
    FROM answers a
    JOIN questions q ON a.question_id = q.id
    JOIN facets f ON q.facet_id = f.id
    WHERE a.session_id = ?
  `, [sessionId]);

  if (answers.length === 0) {
    return res.status(400).json({ error: '尚无作答数据' });
  }

  // 计算各维度分数
  const facetScores = {};
  const dimensionScores = {};

  for (const a of answers) {
    // 反向计分转换：5 -> 1, 4 -> 2, 3 -> 3, 2 -> 4, 1 -> 5
    const rawScore = a.reverse_scored ? (6 - a.answer_value) : a.answer_value;

    const facetKey = a.dimension_code + '_' + a.facet_name;
    if (!facetScores[facetKey]) {
      facetScores[facetKey] = { dimension: a.dimension_code, facet: a.facet_name, total: 0, count: 0 };
    }
    facetScores[facetKey].total += rawScore;
    facetScores[facetKey].count++;
  }

  // 聚合维度分数
  for (const val of Object.values(facetScores)) {
    const avg = val.total / val.count;
    const percentile = Math.round(((avg - 1) / 4) * 100);

    if (!dimensionScores[val.dimension]) {
      dimensionScores[val.dimension] = { facets: [] };
    }
    dimensionScores[val.dimension].facets.push({
      name: val.facet,
      score: Math.round(avg * 10) / 10,
      percentile
    });
  }

  // 计算维度总体分
  const dimOrder = ['H', 'E', 'X', 'A', 'C', 'O'];
  const result = {};
  for (const dim of dimOrder) {
    if (dimensionScores[dim]) {
      const facets = dimensionScores[dim].facets;
      const dimAvg = facets.reduce((s, f) => s + f.score, 0) / facets.length;
      const dimPercentile = Math.round(((dimAvg - 1) / 4) * 100);
      result[dim] = {
        score: Math.round(dimAvg * 10) / 10,
        percentile: dimPercentile,
        facets
      };
    }
  }

  res.json(result);
});

module.exports = router;
