const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
When making changes to this schema,
be a good samaritan and change add refactor the corresponding front end schema in shuttle.ts
*/
var shuttleSchema = new Schema({
      isActive: Boolean,
      origin: Array,
      destination: Array,
      departureDateTime: Date,
      maxCapacity: Number,
      vacancies: Number,
      guestsAllowed: Number,
      riders: Array,
      waitlist: Array,
      notes: String,
      group: Schema.Types.ObjectId
});

module.exports = mongoose.model('Shuttle', shuttleSchema);
