'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ObjectId = mongoose.Schema.Types.ObjectId;
var TaskSchema = new Schema({
  name: String,
  user: ObjectId,
  recurring: Boolean,
  recurringInterval: Number,
  status: {type:String, default: 'incomplete'},
  date: {type: Date, default: Date.now, set: sanitiseDate },
  selected: {type: Boolean, default: false},
});

function sanitiseDate(date){
	if(date=='now')	date = Date.now();
	return date;
}

module.exports = mongoose.model('Task', TaskSchema);