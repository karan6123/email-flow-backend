const express = require('express');
const router = express.Router();
const { agenda } = require('../jobs/agenda');

router.post('/', async (req, res) => {
  const { to, subject, body, delay } = req.body;
  if (!to || !subject || !body || !delay) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await agenda.schedule(new Date(Date.now() + delay), 'send-email', { to, subject, body });
  res.json({ message: 'Email scheduled successfully' });
});

module.exports = router;
