import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// ============ TYPES ============

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  pagination?: PaginationMeta;
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============ MOCK DATABASE ============

let users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

// ============ MIDDLEWARE ============

// PRINCIPLE 1: Consistent error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: err.details || []
    }
  });
});

// PRINCIPLE 2: Pagination middleware
function paginate(req: Request, res: Response, next: NextFunction) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(parseInt(req.query.limit as string) || 20, 100));
  const skip = (page - 1) * limit;

  res.locals.pagination = { page, limit, skip };
  next();
}

// PRINCIPLE 3: Input validation middleware
function validateCreateUser(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;
  const errors: Record<string, string>[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', issue: 'Name is required and must be a non-empty string' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push({ field: 'email', issue: 'Valid email is required' });
  }
  if (users.some(u => u.email === email)) {
    errors.push({ field: 'email', issue: 'Email already exists' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: errors
      }
    });
  }

  next();
}

function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;
  const errors: Record<string, string>[] = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push({ field: 'name', issue: 'Name must be a non-empty string' });
  }
  if (email !== undefined && (typeof email !== 'string' || !email.includes('@'))) {
    errors.push({ field: 'email', issue: 'Email must be valid' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: errors
      }
    });
  }

  next();
}

// ============ ENDPOINTS ============

// PRINCIPLE 4: RESTful conventions (nouns, proper HTTP methods)
// GET /api/v1/users - List all users with pagination
app.get('/api/v1/users', paginate, (req: Request, res: Response) => {
  const { page, limit, skip } = res.locals.pagination;
  const total = users.length;
  const paginatedUsers = users.slice(skip, skip + limit);
  const pages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: { page, limit, total, pages }
  } as ApiResponse<User[]>);
});

// GET /api/v1/users/:id - Get single user
app.get('/api/v1/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'User ID must be a number',
        details: [{ field: 'id', issue: 'Invalid format' }]
      }
    });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found'
      }
    });
  }

  res.json({
    success: true,
    data: user
  } as ApiResponse<User>);
});

// POST /api/v1/users - Create new user
app.post('/api/v1/users', validateCreateUser, (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser: User = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    name: name.trim(),
    email: email.trim().toLowerCase()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser
  } as ApiResponse<User>);
});

// PUT /api/v1/users/:id - Replace user
app.put('/api/v1/users/:id', validateUpdateUser, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'User ID must be a number'
      }
    });
  }

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found'
      }
    });
  }

  const { name, email } = req.body;
  users[userIndex] = {
    id,
    name: name.trim(),
    email: email.trim().toLowerCase()
  };

  res.json({
    success: true,
    data: users[userIndex]
  } as ApiResponse<User>);
});

// DELETE /api/v1/users/:id - Delete user
app.delete('/api/v1/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'User ID must be a number'
      }
    });
  }

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found'
      }
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(204).send();
});

// ============ START SERVER ============

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log('\nBEST PRACTICES DEMONSTRATED:');
  console.log('1. RESTful conventions (resources as nouns: /users, /users/:id)');
  console.log('2. Proper HTTP methods (GET, POST, PUT, DELETE)');
  console.log('3. Correct status codes (201 for create, 204 for delete, 404 for not found)');
  console.log('4. Consistent response format (success, data, error)');
  console.log('5. Comprehensive error handling (validation errors with details)');
  console.log('6. Input validation before business logic');
  console.log('7. Pagination support on list endpoints');
  console.log('8. No stack traces exposed to clients');
  console.log('9. Semantic error codes (NOT_FOUND, VALIDATION_ERROR)');
  console.log('10. Type-safe responses using TypeScript interfaces');
  console.log('\nTry these commands:');
  console.log('  curl http://localhost:3001/api/v1/users | jq .');
  console.log('  curl http://localhost:3001/api/v1/users/1 | jq .');
  console.log('  curl -X POST http://localhost:3001/api/v1/users \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"name":"Dave","email":"dave@example.com"}\' | jq .');
  console.log('');
});
