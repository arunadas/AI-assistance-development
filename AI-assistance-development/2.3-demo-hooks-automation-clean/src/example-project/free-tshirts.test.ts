/**
 * Tests for the Free T-Shirts feature module
 *
 * These tests demonstrate the test patterns that should be used
 * when Claude generates or modifies feature routers.
 */

import express from 'express';
import request from 'supertest';
import freeTshirtsRouter from './free-tshirts';

const app = express();
app.use(express.json());
app.use('/free-tshirts', freeTshirtsRouter);

describe('Free T-Shirts API', () => {
  describe('GET /free-tshirts', () => {
    it('should return an empty array initially', async () => {
      const response = await request(app).get('/free-tshirts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /free-tshirts', () => {
    it('should create a new free t-shirt with valid input', async () => {
      const tshirtData = {
        size: 'L',
        design: 'Claude Code Logo',
      };

      const response = await request(app)
        .post('/free-tshirts')
        .send(tshirtData);

      expect(response.status).toBe(201);
      expect(response.body.size).toBe(tshirtData.size);
      expect(response.body.design).toBe(tshirtData.design);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 if size is missing', async () => {
      const tshirtData = { design: 'Missing size' };

      const response = await request(app)
        .post('/free-tshirts')
        .send(tshirtData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if design is missing', async () => {
      const tshirtData = { size: 'M' };

      const response = await request(app)
        .post('/free-tshirts')
        .send(tshirtData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /free-tshirts/:id', () => {
    it('should return a free t-shirt that was created', async () => {
      const createResponse = await request(app)
        .post('/free-tshirts')
        .send({ size: 'S', design: 'Terminal Art' });

      const { id } = createResponse.body;

      const response = await request(app).get(`/free-tshirts/${id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('should return 404 for non-existent free t-shirt', async () => {
      const response = await request(app).get('/free-tshirts/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /free-tshirts/:id', () => {
    it('should update an existing free t-shirt', async () => {
      const createResponse = await request(app)
        .post('/free-tshirts')
        .send({ size: 'XL', design: 'Original' });

      const { id } = createResponse.body;

      const response = await request(app)
        .put(`/free-tshirts/${id}`)
        .send({ design: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.body.design).toBe('Updated');
      expect(response.body.size).toBe('XL');
    });

    it('should return 404 when updating non-existent free t-shirt', async () => {
      const updateData = { design: 'Updated' };

      const response = await request(app)
        .put('/free-tshirts/nonexistent')
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /free-tshirts/:id', () => {
    it('should delete an existing free t-shirt', async () => {
      const createResponse = await request(app)
        .post('/free-tshirts')
        .send({ size: 'M', design: 'To Delete' });

      const { id } = createResponse.body;

      const response = await request(app).delete(`/free-tshirts/${id}`);
      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/free-tshirts/${id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent free t-shirt', async () => {
      const response = await request(app).delete('/free-tshirts/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
