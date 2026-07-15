import request from 'supertest';
import app from './app';

describe('Express Application', () => {
  describe('GET /health', () => {
    it('should return health status with 200', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.timestamp);

      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('GET /features', () => {
    it('should return list of features', async () => {
      const response = await request(app).get('/features');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return features with correct structure', async () => {
      const response = await request(app).get('/features');

      response.body.forEach((feature: any) => {
        expect(feature).toHaveProperty('id');
        expect(feature).toHaveProperty('name');
        expect(feature).toHaveProperty('enabled');
        expect(typeof feature.enabled).toBe('boolean');
      });
    });
  });

  describe('POST /tasks', () => {
    it('should create a task with title and description', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('This is a test task');
      expect(response.body.completed).toBe(false);
    });

    it('should create a task with only title', async () => {
      const taskData = {
        title: 'Minimal Task'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.description).toBe('');
    });

    it('should reject request without title', async () => {
      const taskData = {
        description: 'Missing title'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by ID', async () => {
      const response = await request(app).get('/tasks/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 123);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('completed');
    });

    it('should reject invalid task ID', async () => {
      const response = await request(app).get('/tasks/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
