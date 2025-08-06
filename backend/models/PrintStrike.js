const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  fileId: mongoose.Schema.Types.ObjectId,
  type: String,
  comments: Array,
}, { _id: false });

const commentSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: { type: Date, default: Date.now }
}, { _id: false });

const PrintStrikeSchema = new mongoose.Schema({
  season: { type: String, required: true },
  printStrikeNumber: { type: String, required: true },
  files: [fileSchema],
  manager: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
  comments: [commentSchema],
  selectedTechpack: String
}, { timestamps: true, collection: 'printstrikes' });

module.exports = mongoose.model('PrintStrike', PrintStrikeSchema); 