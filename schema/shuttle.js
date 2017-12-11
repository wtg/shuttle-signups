const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
When making changes to this schema,
be a good samaritan and change add refactor the corresponding front end schema in shuttle.ts
*/
var shuttleSchema = new Schema({
      isActive: Boolean,
      type: String,
      departureDateTime: Date,
      maxCapacity: Number,
      vacancies: Number,
      guestsAllowed: Number,
      riders: Array,
      waitlist: Array,
      group: Schema.Types.ObjectId,
      reminderObject: Schema.Types.Mixed,
      closeSignup: Date
});

module.exports = mongoose.model('Shuttle', shuttleSchema);
