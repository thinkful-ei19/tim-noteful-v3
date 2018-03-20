'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({

  title: { type: String },
  content: { type: String },
  created: { type: Date, default: Date.now }


});

module.exports = mongoose.model('Note', noteSchema);