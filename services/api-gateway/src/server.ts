import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

// Auth verification placeholder (later: verify JWT, attach user)
app.use((req, _res, next) => {
  // TODO: decode JWT if present and set req.user
  next();
});

// Proxy rules (adjust ports if services differ)
app.use('/api/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL || 'http://user-service:4001', changeOrigin: true, pathRewrite: {'^/api/users': ''} }));
app.use('/api/recipes', createProxyMiddleware({ target: process.env.RECIPE_SERVICE_URL || 'http://recipe-service:4002', changeOrigin: true, pathRewrite: {'^/api/recipes': ''} }));

const port = process.env.GATEWAY_PORT || 4000;
app.listen(port, () => {
  console.log(`API Gateway listening on ${port}`);
});
