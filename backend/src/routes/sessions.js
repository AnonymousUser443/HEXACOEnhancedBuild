const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../dbhelper');
const { calculateFullResult } = require('../scoringEngine');
const { SJT_QUESTIONS } = require('../sjtQuestions');

const router = express.Router();

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.replace(/[<>\"'&]/g, (char) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    }[char]));
  }
  return input;
}

function validateSessionId(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') {
    return { valid: false, error: '会话ID无效' };
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return { valid: false, error: '会话ID格式不正确' };
  }
  return { valid: true };
}

router.get('/sjt/questions', (req, res) => {
  res.json(SJT_QUESTIONS);
});

// 前端通过索引提交 SJT 答案: { question_index, answer_index }
router.post('/:sessionId/sjt', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { question_index, answer_index } = req.body;
  
  if (typeof question_index !== 'number' || question_index < 0) {
    return res.status(400).json({ error: '题目索引无效' });
  }
  if (typeof answer_index !== 'number' || answer_index < 0) {
    return res.status(400).json({ error: '选项索引无效' });
  }
  
  const question = SJT_QUESTIONS[question_index];
  if (!question) return res.status(404).json({ error: '题目不存在' });
  
  const option = question.options[answer_index];
  if (!option) return res.status(400).json({ error: '选项无效' });
  
  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });
  
  try {
    const existing = get(
      'SELECT id FROM sjt_answers WHERE session_id = ? AND question_id = ?',
      [sessionId, question.id]
    );
    
    if (existing) {
      run(
        'UPDATE sjt_answers SET answer_value = ? WHERE session_id = ? AND question_id = ?',
        [option.id, sessionId, question.id]
      );
    } else {
      run(
        'INSERT INTO sjt_answers (session_id, question_id, answer_value) VALUES (?, ?, ?)',
        [sessionId, question.id, option.id]
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.post('/:sessionId/sjt-answers', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { questionId, answerValue } = req.body;
  
  if (!questionId || typeof questionId !== 'number') {
    return res.status(400).json({ error: '题目ID必须是数字' });
  }
  
  if (!answerValue || typeof answerValue !== 'string') {
    return res.status(400).json({ error: '选项ID必须是字符串' });
  }
  
  const sanitizedAnswerValue = sanitizeInput(answerValue);
  
  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });
  
  const question = SJT_QUESTIONS.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: '题目不存在' });
  
  const option = question.options.find(o => o.id === sanitizedAnswerValue);
  if (!option) return res.status(400).json({ error: '选项无效' });
  
  try {
    const existing = get(
      'SELECT id FROM sjt_answers WHERE session_id = ? AND question_id = ?',
      [sessionId, questionId]
    );
    
    if (existing) {
      run(
        'UPDATE sjt_answers SET answer_value = ? WHERE session_id = ? AND question_id = ?',
        [sanitizedAnswerValue, sessionId, questionId]
      );
    } else {
      run(
        'INSERT INTO sjt_answers (session_id, question_id, answer_value) VALUES (?, ?, ?)',
        [sessionId, questionId, sanitizedAnswerValue]
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.post('/', (req, res) => {
  try {
    const userId = uuidv4();
    const sessionId = uuidv4();
    
    run('INSERT INTO users (id) VALUES (?)', [userId]);
    run('INSERT INTO sessions (id, user_id) VALUES (?, ?)', [sessionId, userId]);
    
    res.status(201).json({ id: sessionId, sessionId, userId });
  } catch (err) {
    res.status(500).json({ error: '创建会话失败' });
  }
});

router.post('/:sessionId/answers', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  // 兼容前端发送的 snake_case 字段名 (question_id, answer_value)
  const questionId = req.body.questionId ?? req.body.question_id;
  const answerValue = req.body.answerValue ?? req.body.answer_value;
  const responseTimeMs = req.body.responseTimeMs ?? req.body.response_time_ms;
  
  if (!questionId || typeof questionId !== 'number') {
    return res.status(400).json({ error: '题目ID必须是数字' });
  }
  
  if (answerValue === undefined || answerValue === null || typeof answerValue !== 'number') {
    return res.status(400).json({ error: '分值必须是数字' });
  }
  
  if (answerValue < 1 || answerValue > 5) {
    return res.status(400).json({ error: '分值必须在 1-5 之间' });
  }
  
  if (responseTimeMs !== undefined && (typeof responseTimeMs !== 'number' || responseTimeMs < 0)) {
    return res.status(400).json({ error: '响应时间必须是非负数字' });
  }
  
  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  if (session.status === 'completed') return res.status(400).json({ error: '该会话已结束' });
  
  const question = get('SELECT id FROM questions WHERE id = ?', [questionId]);
  if (!question) return res.status(404).json({ error: '题目不存在' });
  
  try {
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
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.get('/:sessionId/progress', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
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
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.post('/:sessionId/complete', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  const session = get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return res.status(404).json({ error: '会话不存在' });
  
  try {
    run(
      "UPDATE sessions SET status = 'completed', completed_at = datetime('now') WHERE id = ?",
      [sessionId]
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.get('/:sessionId/result', (req, res) => {
  const { sessionId } = req.params;
  
  const validation = validateSessionId(sessionId);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
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
    
    const result = calculateFullResult(answers, sjtAnswers);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: '计算结果失败' });
  }
});

module.exports = router;