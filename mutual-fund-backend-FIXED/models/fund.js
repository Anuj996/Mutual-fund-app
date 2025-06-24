const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fundName: {
    type: String,
    required: true,
  },
  schemeCode: {
    type: String,
    required: true,
  },
  fundData: {
    type: Object, // Store full fund object from mfapi.in
    required: true,
  }
});

module.exports = mongoose.model('Fund', fundSchema);
