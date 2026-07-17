import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Mock database
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

// --- Error Helper ---
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: { field: string; issue: string }[]
  ) {
    super(message);
  }
}

// --- Pagination Middleware ---
function paginate(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;
  res.locals.pagination = { page, limit, skip };
  next();
}

// --- Routes (v1) ---

// GET /v1/users — list with pagination
app.get('/v1/users', paginate, (req: Request, res: Response) => {
  const { page, limit, skip } = res.locals.pagination;
  const paginatedUsers = users.slice(skip, skip + limit);
  const total = users.length;

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// GET /v1/users/:id — read single user
app.get('/v1/users/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return next(new ApiError(404, 'NOT_FOUND', 'User not found'));
  }

  res.json({ success: true, data: user });
});

// POST /v1/users — create a user
app.post('/v1/users', (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  const errors: { field: string; issue: string }[] = [];
  if (!name) errors.push({ field: 'name', issue: 'is required' });
  if (!email) errors.push({ field: 'email', issue: 'is required' });
  if (email && users.some((u) => u.email === email)) {
    errors.push({ field: 'email', issue: 'already exists' });
  }

  if (errors.length) {
    return next(
      new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', errors)
    );
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, data: newUser });
});

// PATCH /v1/users/:id — update a user
app.patch('/v1/users/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return next(new ApiError(404, 'NOT_FOUND', 'User not found'));
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ success: true, data: user });
});

// DELETE /v1/users/:id — remove a user
app.delete('/v1/users/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return next(new ApiError(404, 'NOT_FOUND', 'User not found'));
  }

  users.splice(index, 1);
  res.status(204).send();
});

// --- Error Handler Middleware ---
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'SERVER_ERROR';
  const message =
    statusCode === 500 ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(error.details && { details: error.details }),
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
