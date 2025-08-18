// backend/routes/skills.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Skill = require('../models/Skill');
const User = require('../models/User');

// GET /api/skills - list all skills (pagination simple)
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  try {
    const skills = await Skill.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ]
    }).populate('owner', 'name email bio');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/skills - create a skill (protected)
router.post('/', protect, async (req, res) => {
  const { title, description, tags = [], type } = req.body;
  try {
    const skill = new Skill({
      owner: req.user._id,
      title,
      description,
      tags: tags.map(t => t.toLowerCase()),
      type
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/skills/:id
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('owner', 'name email bio');
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
