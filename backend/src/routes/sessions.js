const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../dbhelper');
const { calculateFullResult } = require('../scoringEngine');
const { SJT_QUESTIONS } = require('../sjtQuestions');

const router = express.Router();

router.get('/sjt/questions', (req, res) => {
  res.json(SJT_QUESTIONS);
});

router.post('/:sessionId/sjt-answers', (req, res) => {
  const { sessionId } = req.params;
  const { questionId, answerValue } = req.body;

  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });

  const question = SJT_QUESTIONS.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: '题目不存在' });

  const option = question.options.find(o => o.id === answerValue);
  if (!option) return res.status(400).json({ error: '选项无效' });

  const existing = get(
    'SELECT id FROM sjt_answers WHERE session_id = ? AND question_id = ?',
    [sessionId, questionId]
  );

  if (existing) {
    run(
      'UPDATE sjt_answers SET answer_value = ? WHERE session_id = ? AND question_id = ?',
      [answerValue, sessionId, questionId]
    );
  } else {
    run(
      'INSERT INTO sjt_answers (session_id, question_id, answer_value) VALUES (?, ?, ?)',
      [sessionId, questionId, answerValue]
    );
  }

  res.json({ success: true });
});

router.post('/', (req, res) => {
  const userId = uuidv4();
  const sessionId = uuidv4();

  run('INSERT INTO users (id) VALUES (?)', [userId]);
  run('INSERT INTO sessions (id, user_id) VALUES (?, ?)', [sessionId, userId]);

  res.status(201).json({ sessionId, userId });
});

router.post('/:sessionId/answers', (req, res) => {
  const { sessionId } = req.params;
  const { questionId, answerValue, responseTimeMs } = req.body;

  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });

  const question = get('SELECT id FROM questions WHERE id = ?', [questionId]);
  if (!question) return res.status(404).json({ error: '题目不存在' });

  if (answerValue < 1 || answerValue > 5) {
    return res.status(400).json({ error: '分值必须在 1-5 之间' });
  }

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

router.get('/:sessionId/result', (req, res) => {
  const { sessionId } = req.params;

  const answers = all(`
    SELECT a.answer_value, a.response_time_ms, q.reverse_scored, q.id as question_id,
           f.dimension_code, f.name as facet_name
    FROM answers a
    JOIN questions q ON a.question_id = q.id
    JOIN facets f ON q.facet_id = f.id
    WHERE a.session_id = ?
  `, [sessionId]);

  if (answers.length === 0) {
    return res.status(400).json({ error: '尚无作答数据' });
  }

  const sjtAnswers = all(`
    SELECT question_id, answer_value
    FROM sjt_answers
    WHERE session_id = ?
  `, [sessionId]);

  try {
    const result = calculateFullResult(answers, sjtAnswers);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
