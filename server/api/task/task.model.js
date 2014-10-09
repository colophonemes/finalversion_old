'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ObjectId = mongoose.Schema.Types.ObjectId;
var TaskSchema = new Schema({
  name: String,
  user: ObjectId,
  recurring: Boolean,
  recurringInterval: Number,
  status: String
});

module.exports = mongoose.model('Task', TaskSchema);