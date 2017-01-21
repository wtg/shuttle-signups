const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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