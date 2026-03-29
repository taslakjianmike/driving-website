const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/topic/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    const result = await pool.query(
      `SELECT q.*, json_agg(a ORDER BY a.number) AS answers
       FROM questions q
       LEFT JOIN answers a ON a.question_id = q.id
       WHERE q.topic_id = $1
       GROUP BY q.id
       ORDER BY q.id`,
      [topicId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT q.*, json_agg(a ORDER BY a.number) AS answers
       FROM questions q
       LEFT JOIN answers a ON a.question_id = q.id
       WHERE q.id = $1
       GROUP BY q.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;