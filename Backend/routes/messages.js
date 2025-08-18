// backend/routes/messages.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Message = require('../models/Message');

// GET /api/messages/conversations/:userId - messages between current user and userId
router.get('/conversations/:userId', protect, async (req, res) => {
  const other = req.params.userId;
  try {
    const msgs = await Message.find({
      $or: [
        { sender: req.user._id, receiver: other },
        { sender: other, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages - store a message (body: { to, text, skill })
router.post('/', protect, async (req, res) => {
  const { to, text, skill } = req.body;
  try {
    const m = await Message.create({
      sender: req.user._id,
      receiver: to,
      text,
      skill
    });
    res.status(201).json(m);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
