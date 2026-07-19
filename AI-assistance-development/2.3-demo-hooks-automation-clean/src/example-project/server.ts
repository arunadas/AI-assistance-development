/**
 * Chapter 2.3: Custom Slash Commands & Workflow Automation Demo (Clean)
 *
 * A simple Express server — the starting point before adding
 * custom slash commands. No .claude/ directory yet.
 *
 * This server provides basic CRUD operations for notes.
 * During the demo, you'll create commands like:
 * - /verify  — run tests + lint and get a summary
 * - /review  — structured code review with severity levels
 * - /scaffold — generate a new feature module with tests
 */

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory storage for demo
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const notes: Map<string, Note> = new Map();

// Routes

/**
 * GET /notes
 * Retrieve all notes
 */
app.get('/notes', (req, res) => {
  try {
    const noteList = Array.from(notes.values());
    res.json(noteList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

/**
 * GET /notes/:id
 * Retrieve a specific note by ID
 */
app.get('/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const note = notes.get(id);

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

/**
 * POST /notes
 * Create a new note
 */
app.post('/notes', (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const id = Date.now().toString();
    const note: Note = {
      id,
      title,
      content,
      createdAt: new Date(),
    };

    notes.set(id, note);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * PUT /notes/:id
 * Update an existing note
 */
app.put('/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = notes.get(id);
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    if (title) note.title = title;
    if (content) note.content = content;

    notes.set(id, note);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

/**
 * DELETE /notes/:id
 * Delete a note
 */
app.delete('/notes/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!notes.has(id)) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    notes.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});

export default app;
