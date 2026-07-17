import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// Mock database
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

// ANTI-PATTERN 1: Verb-based endpoints
app.get('/getUsers', (req: Request, res: Response) => {
  res.send(users);
});

// ANTI-PATTERN 2: No error handling
app.get('/getUserById/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  res.send(user);
});

// ANTI-PATTERN 3: Inconsistent response format
app.post('/createUser', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.send({ error: 'Name and email are required' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.send({ message: 'User created successfully', user: newUser });
});

// ANTI-PATTERN 4: No validation
app.put('/updateUser/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    res.send({ message: 'User not found' });
  } else {
    Object.assign(user, req.body);
    res.send(user);
  }
});

// ANTI-PATTERN 5: Missing status codes (HTTP 200 for errors)
app.delete('/deleteUser/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    res.send({ error: 'User not found' });
  } else {
    users.splice(index, 1);
    res.send({ message: 'User deleted' });
  }
});

// ANTI-PATTERN 6: No pagination
app.get('/allUsers', (req: Request, res: Response) => {
  res.send(users);
});

// ANTI-PATTERN 7: Exposing implementation details
app.get('/users/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found in database`);
    }
    res.send(user);
  } catch (error: any) {
    res.send({ error: error.message, stack: error.stack });
  }
});

// ANTI-PATTERN 8: Inconsistent HTTP methods
app.get('/removeUser/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  users.splice(index, 1);
  res.send({ result: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('ANTI-PATTERNS IN THIS SERVER:');
  console.log('1. Verb-based endpoints (/getUsers instead of /users)');
  console.log('2. No error handling (returns undefined)');
  console.log('3. Inconsistent response formats');
  console.log('4. No input validation');
  console.log('5. HTTP 200 for errors (should be 400, 404, etc.)');
  console.log('6. No pagination on list endpoints');
  console.log('7. Exposes stack traces to clients');
  console.log('8. Uses GET for delete operations');
  console.log('9. Inconsistent endpoint naming');
  console.log('10. No error codes, just error messages');
});
