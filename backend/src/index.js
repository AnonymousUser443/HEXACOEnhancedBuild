const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const { seedDatabase } = require('./seed');
const questionsRouter = require('./routes/questions');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 启动服务器（异步初始化数据库）
async function start() {
  await initDb();
  seedDatabase();

  // 路由
  app.use('/api', questionsRouter);
  app.use('/api/sessions', sessionsRouter);

  // 健康检查
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`后端服务已启动: http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
