import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/recipes' });

app.get('/healthz', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', service: 'notification-service' }); } catch(e) { res.status(500).json({ status: 'error', error: (e as Error).message }); }
});

app.get('/pending', (_req, res) => { res.json({ notifications: [], message: 'Notification service stub' }); });

const port = process.env.PORT || 4005;
app.listen(port, () => console.log(`Notification service listening on ${port}`));
