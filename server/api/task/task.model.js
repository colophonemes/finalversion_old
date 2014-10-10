'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ObjectId = mongoose.Schema.Types.ObjectId;
var TaskSchema = new Schema({
  name: String,
  user: ObjectId,
  recurring: Boolean,
  recurringInterval: Number,
  status: String,
  date: {type: Date, default: Date.now},
  selected: {type: Boolean, default: false},
});

module.exports = mongoose.model('Task', TaskSchema);