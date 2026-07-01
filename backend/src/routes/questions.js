const express = require('express');
const { all } = require('../dbhelper');

const router = express.Router();

// 获取所有维度
router.get('/dimensions', (req, res) => {
  const dims = all('SELECT * FROM dimensions ORDER BY sort_order');
  res.json(dims);
});

// 获取指定维度的子面
router.get('/dimensions/:code/facets', (req, res) => {
  const facets = all(
    'SELECT * FROM facets WHERE dimension_code = ? ORDER BY sort_order',
    [req.params.code]
  );
  res.json(facets);
});

// 获取所有题目（含维度/子面信息）
router.get('/questions', (req, res) => {
  const questions = all(`
    SELECT q.id, q.stem, q.reverse_scored, q.sort_order,
           f.id as facet_id, f.name as facet_name,
           d.code as dimension_code, d.name as dimension_name
    FROM questions q
    JOIN facets f ON q.facet_id = f.id
    JOIN dimensions d ON f.dimension_code = d.code
    ORDER BY d.sort_order, f.sort_order, q.sort_order
  `);
  res.json(questions);
});

module.exports = router;
