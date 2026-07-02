require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./database');
const { seedDatabase } = require('./seed');
const questionsRouter = require('./routes/questions');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const MAX_REQUESTS_PER_MINUTE = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 100;

const corsOptions = {
  origin: CORS_ORIGIN.split(',').map(o => o.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
  next();
});

app.use(express.json({
  limit: '100kb',
  strict: true
}));

app.use(express.urlencoded({
  extended: false,
  limit: '100kb'
}));

const requestCounts = new Map();

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  
  const key = `${ip}:${minute}`;
  const count = (requestCounts.get(key) || 0) + 1;
  requestCounts.set(key, count);
  
  if (count > MAX_REQUESTS_PER_MINUTE) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
  }
  
  next();
});

setInterval(() => {
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000);
  requestCounts.forEach((_, key) => {
    const minute = parseInt(key.split(':')[1]);
    if (minute < currentMinute - 1) {
      requestCounts.delete(key);
    }
  });
}, 60000);

const logColors = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(level, message, data = {}) {
  if (['debug', 'info', 'warn', 'error'].indexOf(level) < ['debug', 'info', 'warn', 'error'].indexOf(LOG_LEVEL)) {
    return;
  }
  const timestamp = new Date().toISOString();
  const color = logColors[level] || '';
  const reset = logColors.reset;
  let logStr = `${color}[${level.toUpperCase()}] ${timestamp} - ${message}${reset}`;
  if (Object.keys(data).length > 0) {
    logStr += `\n  ${JSON.stringify(data, null, 2)}`;
  }
  console.log(logStr);
}

app.use((req, res, next) => {
  const start = Date.now();
  log('debug', `Request received: ${req.method} ${req.path}`, {
    ip: req.ip,
    headers: {
      'Content-Type': req.get('Content-Type'),
      'User-Agent': req.get('User-Agent')
    }
  });
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    log('info', `Request completed: ${req.method} ${req.path} ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode
    });
  });
  
  next();
});

async function start() {
  try {
    await initDb();
    seedDatabase();
    log('info', 'Database initialized successfully');
    
    app.use('/api', questionsRouter);
    app.use('/api/sessions', sessionsRouter);
    
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        uptime: process.uptime()
      });
    });
    
    app.listen(PORT, () => {
      log('info', `Backend service started: http://localhost:${PORT}`, {
        environment: NODE_ENV,
        port: PORT,
        corsOrigins: CORS_ORIGIN
      });
    });
  } catch (err) {
    log('error', 'Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

process.on('uncaughtException', (err) => {
  log('error', 'Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('error', 'Unhandled rejection', { reason: reason?.message || reason });
});

start();