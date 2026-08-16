const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// POST /api/feedback - Insert private user feedback into public.feedback
router.post('/', async (req, res) => {
  try {
    const { user_id, name, email, category, message, rating, page_url } = req.body;

    if (!category || !message || !message.trim()) {
      return res.status(400).json({ error: 'Category and non-empty message are required.' });
    }

    if (message.trim().length > 5000) {
      return res.status(400).json({ error: 'Message cannot exceed 5000 characters.' });
    }

    const inserted = await prisma.$queryRaw`
      INSERT INTO public.feedback (user_id, name, email, category, message, rating, page_url, status, created_at)
      VALUES (${user_id || null}::uuid, ${name?.trim() || null}, ${email?.trim() || null}, ${category}, ${message.trim()}, ${rating ? parseInt(rating, 10) : null}, ${page_url || null}, 'new', NOW())
      RETURNING id, created_at;
    `;

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your feedback has been received.',
      data: inserted[0]
    });
  } catch (error) {
    console.error('Error inserting feedback via backend API:', error);
    return res.status(500).json({ error: 'Failed to submit feedback. Please try again.' });
  }
});

module.exports = router;
