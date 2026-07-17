import express, { Request, Response, NextFunction, Router } from 'express';

const app = express();
app.use(express.json());

// --- Error types -----------------------------------------------------

class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: { field: string; issue: string }[];

  constructor(statusCode: number, code: string, message: string, details?: { field: string; issue: string }[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// --- Mock database -----------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];
let nextId = 4;

// --- Middleware --------------------------------------------------------

function paginate(req: Request, res: Response, next: NextFunction) {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  res.locals.pagination = { page, limit, skip: (page - 1) * limit };
  next();
}

function validateUserBody(req: Request, _res: Response, next: NextFunction) {
  const { name, email } = req.body ?? {};
  const details: { field: string; issue: string }[] = [];

  if (!name || typeof name !== 'string') {
    details.push({ field: 'name', issue: 'is required' });
  }
  if (!email || typeof email !== 'string') {
    details.push({ field: 'email', issue: 'is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    details.push({ field: 'email', issue: 'must be a valid email address' });
  }

  if (details.length > 0) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', details));
  }
  next();
}

function findUserOr404(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return next(new ApiError(404, 'NOT_FOUND', `User ${req.params.id} not found`));
  }
  res.locals.user = user;
  next();
}

// --- Router: /v1/users --------------------------------------------------

const router = Router();

// GET /v1/users - list with pagination
router.get('/users', paginate, (_req: Request, res: Response) => {
  const { page, limit, skip } = res.locals.pagination;
  const pageItems = users.slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    data: pageItems,
    error: null,
    pagination: {
      page,
      limit,
      total: users.length,
      pages: Math.ceil(users.length / limit)
    }
  });
});

// GET /v1/users/:id
router.get('/users/:id', findUserOr404, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: res.locals.user,
    error: null
  });
});

// POST /v1/users
router.post('/users', validateUserBody, (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (users.some(u => u.email === email)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', [
      { field: 'email', issue: 'already exists' }
    ]);
  }

  const newUser: User = { id: nextId++, name, email };
  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser,
    error: null
  });
});

// PATCH /v1/users/:id
router.patch('/users/:id', findUserOr404, (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { name, email } = req.body ?? {};

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', [
      { field: 'email', issue: 'must be a valid email address' }
    ]);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  res.status(200).json({
    success: true,
    data: user,
    error: null
  });
});

// DELETE /v1/users/:id
router.delete('/users/:id', findUserOr404, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  users.splice(index, 1);
  res.status(204).send();
});

app.use('/v1', router);

// --- 404 fallback --------------------------------------------------------

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` }
  });
});

// --- Centralized error handler -------------------------------------------

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'SERVER_ERROR';
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: { code, message, ...(error.details ? { details: error.details } : {}) }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints (versioned under /v1):');
  console.log('  GET    /v1/users        - list users (paginated)');
  console.log('  GET    /v1/users/:id    - get a single user');
  console.log('  POST   /v1/users        - create a user');
  console.log('  PATCH  /v1/users/:id    - update a user');
  console.log('  DELETE /v1/users/:id    - delete a user');
});
