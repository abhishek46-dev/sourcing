const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: { type: Date, default: Date.now }
}, { _id: false });

const pantoneSchema = new mongoose.Schema({
  season: String,
  pantoneNumber: String,
  image: String, // stores image path or base64
  manager: String,
  selectedTechpack: String,
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'pantones' });

module.exports = mongoose.model('Pantone', pantoneSchema); 