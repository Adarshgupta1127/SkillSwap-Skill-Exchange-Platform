// backend/models/Skill.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  type: { type: String, enum: ['offer', 'seek'], required: true }, // offer or seek
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', SkillSchema);
