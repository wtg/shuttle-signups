const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shuttleGroupSchema = new Schema({
      destination: String,
      origin: Array,
      departureDate: Date,
      shuttles: Array
});

module.exports = mongoose.model('ShuttleGroup', shuttleSchema);