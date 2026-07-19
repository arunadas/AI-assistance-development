/**
 * Free T-Shirts feature module
 *
 * Provides basic CRUD operations for free t-shirt giveaway entries.
 * Mount this router in server.ts under a base path, e.g. '/free-tshirts'.
 */

import { Router } from 'express';

const router = Router();

// In-memory storage for demo
interface FreeTshirt {
  id: string;
  size: string;
  design: string;
  createdAt: Date;
}

const freeTshirts: Map<string, FreeTshirt> = new Map();

/**
 * GET /
 * Retrieve all free t-shirts
 */
router.get('/', (req, res) => {
  try {
    const freeTshirtList = Array.from(freeTshirts.values());
    res.json(freeTshirtList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve free t-shirts' });
  }
});

/**
 * GET /:id
 * Retrieve a specific free t-shirt by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const freeTshirt = freeTshirts.get(id);

    if (!freeTshirt) {
      res.status(404).json({ error: 'Free t-shirt not found' });
      return;
    }

    res.json(freeTshirt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve free t-shirt' });
  }
});

/**
 * POST /
 * Create a new free t-shirt
 */
router.post('/', (req, res) => {
  try {
    const { size, design } = req.body;

    if (!size || !design) {
      res.status(400).json({ error: 'Size and design are required' });
      return;
    }

    const id = Date.now().toString();
    const freeTshirt: FreeTshirt = {
      id,
      size,
      design,
      createdAt: new Date(),
    };

    freeTshirts.set(id, freeTshirt);
    res.status(201).json(freeTshirt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create free t-shirt' });
  }
});

/**
 * PUT /:id
 * Update an existing free t-shirt
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { size, design } = req.body;

    const freeTshirt = freeTshirts.get(id);
    if (!freeTshirt) {
      res.status(404).json({ error: 'Free t-shirt not found' });
      return;
    }

    if (size) freeTshirt.size = size;
    if (design) freeTshirt.design = design;

    freeTshirts.set(id, freeTshirt);
    res.json(freeTshirt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update free t-shirt' });
  }
});

/**
 * DELETE /:id
 * Delete a free t-shirt
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!freeTshirts.has(id)) {
      res.status(404).json({ error: 'Free t-shirt not found' });
      return;
    }

    freeTshirts.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete free t-shirt' });
  }
});

export default router;
