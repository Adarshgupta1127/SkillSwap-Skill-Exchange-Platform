// backend/routes/matches.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Skill = require('../models/Skill');

// GET /api/matches/skill/:skillId - find opposite-type skills with tag overlap
router.get('/skill/:skillId', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const oppositeType = skill.type === 'offer' ? 'seek' : 'offer';

    const matches = await Skill.find({
      _id: { $ne: skill._id },
      type: oppositeType,
      tags: { $in: skill.tags }
    }).populate('owner', 'name email bio');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
