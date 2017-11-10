const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shuttleGroupSchema = new Schema({
      destination: Array,
      origin: Array,
      startDate: Date,
      endDate: Date,
      isActive: Boolean,
      destinationPhoto: String,
      notes: String,
      shuttles: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('ShuttleGroup', shuttleGroupSchema);