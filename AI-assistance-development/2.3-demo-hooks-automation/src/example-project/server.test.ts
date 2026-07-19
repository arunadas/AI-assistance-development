/**
 * Tests for the Notes API server
 *
 * These tests demonstrate the test patterns that should be used
 * when Claude generates or modifies the server.
 */

import request from 'supertest';
import app from './server';

describe('Notes API', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('GET /notes', () => {
    it('should return an empty array initially', async () => {
      const response = await request(app).get('/notes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /notes', () => {
    it('should create a new note with valid input', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note',
      };

      const response = await request(app)
        .post('/notes')
        .send(noteData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(noteData.title);
      expect(response.body.content).toBe(noteData.content);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const noteData = { content: 'Missing title' };

      const response = await request(app)
        .post('/notes')
        .send(noteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if content is missing', async () => {
      const noteData = { title: 'Missing content' };

      const response = await request(app)
        .post('/notes')
        .send(noteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /notes/:id', () => {
    it('should return 404 for non-existent note', async () => {
      const response = await request(app).get('/notes/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should return 404 when updating non-existent note', async () => {
      const updateData = { title: 'Updated' };

      const response = await request(app)
        .put('/notes/nonexistent')
        .send(updateData);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should return 404 when deleting non-existent note', async () => {
      const response = await request(app).delete('/notes/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
