import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { registerRequestSchema, loginRequestSchema } from 'api-schemas';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const prisma = new PrismaClient();

// Utility: pick safe user fields
function serializeUser(u: any) {
  if (!u) return null;
  const { id, email, name, createdAt, updatedAt } = u;
  return { id, email, name, createdAt, updatedAt };
}

app.get('/healthz', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'user-service' });
  } catch (e) {
    res.status(500).json({ status: 'error', error: (e as Error).message });
  }
});

// Auth: Register
app.post('/register', async (req: Request, res: Response) => {
  const parseResult = registerRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request', issues: parseResult.error.issues });
  }
  const { email, password, name } = parseResult.data;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ token, user: serializeUser(user) });
  } catch (e) {
    res.status(500).json({ error: 'Registration failed', detail: (e as Error).message });
  }
});

// Auth: Login
app.post('/login', async (req: Request, res: Response) => {
  const parsed = loginRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', issues: parsed.error.issues });
  const { email, password } = parsed.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ token, user: serializeUser(user) });
  } catch (e) {
    res.status(500).json({ error: 'Login failed', detail: (e as Error).message });
  }
});

// Me route (auth optional)
app.get('/me', async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.json({ user: null });
    const token = auth.slice(7);
    let payload: any;
    try { payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); } catch { return res.status(401).json({ user: null, error: 'Invalid token' }); }
    const user = await prisma.user.findUnique({ where: { id: payload.sub as string } });
    return res.json({ user: serializeUser(user) });
  } catch (e) {
    res.status(500).json({ error: 'Failed', detail: (e as Error).message });
  }
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`User service listening on ${port}`));
