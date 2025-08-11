import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic health & readiness
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway', time: new Date().toISOString() });
});

// Simple request ID (placeholder for proper tracing)
app.use((req, _res, next) => {
  (req as any).reqId = Math.random().toString(36).slice(2);
  next();
});

// Initialize tracing (lazy) if TRACE_ENABLED
if (process.env.TRACE_ENABLED) {
  try { await (async () => { const { initTracing } = await import('tracing/src/index.js'); initTracing('api-gateway'); })(); } catch (e) { console.warn('Tracing init failed', e); }
}

// Auth verification placeholder (later: verify JWT, attach user)
app.use((req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      (req as any).user = payload;
    } catch (e) {
      // ignore invalid token for now; future: respond 401 for protected paths
    }
  }
  next();
});

// Proxy rules (adjust ports if services differ)
app.use('/api/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL || 'http://user-service:4001', changeOrigin: true, pathRewrite: {'^/api/users': ''} }));
app.use('/api/recipes', createProxyMiddleware({ target: process.env.RECIPE_SERVICE_URL || 'http://recipe-service:4002', changeOrigin: true, pathRewrite: {'^/api/recipes': ''} }));

const port = process.env.GATEWAY_PORT || 4000;
app.listen(port, () => {
  console.log(`API Gateway listening on ${port}`);
});
