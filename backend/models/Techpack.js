const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: { type: Date, default: Date.now }
}, { _id: false });

const techpackSchema = new mongoose.Schema({
  name: String,
  description: String,
  articletype: String,
  colour: String,
  fit: String,
  gender: String,
  printtechnique: String,
  status: String,
  brandManager: String,
  styleId: String,
  timestamp: String,
  previewUrl: String,
  totalPages: Number,
  pdfPath: String,
  pdfOriginalName: String,
  comments: [commentSchema]
}, { collection: 'tech--packs' });

module.exports = mongoose.model('Techpack', techpackSchema); 