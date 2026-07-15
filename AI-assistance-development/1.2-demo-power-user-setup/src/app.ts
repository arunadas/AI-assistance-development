import express, { Express, Request, Response } from 'express';

interface Feature {
  id: number;
  name: string;
  enabled: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

const app: Express = express();

app.use(express.json());

const features: Feature[] = [
  { id: 1, name: 'User Authentication', enabled: true },
  { id: 2, name: 'Dark Mode', enabled: true },
  { id: 3, name: 'Real-time Notifications', enabled: false },
];

function getHealth(req: Request, res: Response): void {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

function getFeatures(req: Request, res: Response): void {
  res.status(200).json(features);
}

function createTask(req: Request, res: Response): Response | void {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task: Task = {
    id: Date.now(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(task);
}

function getTaskById(req: Request, res: Response): Response | void {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const task: Task = {
    id: taskId,
    title: 'Sample Task',
    description: 'This is a sample task',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  res.status(200).json(task);
}

app.get('/health', getHealth);
app.get('/features', getFeatures);
app.post('/tasks', createTask);
app.get('/tasks/:id', getTaskById);

export default app;
