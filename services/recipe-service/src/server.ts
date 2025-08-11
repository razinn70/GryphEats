import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const prisma = new PrismaClient();

app.get('/healthz', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', service: 'recipe-service' });
  } catch (e) {
    res.status(500).json({ status: 'error', error: (e as Error).message });
  }
});

// Placeholder route
app.get('/', async (_req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({ take: 20, orderBy: { createdAt: 'desc' } });
    res.json({ recipes });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`Recipe service listening on ${port}`));
