const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shuttleGroupSchema = new Schema({
      destination: Array,
      origin: Array,
      startDate: Date,
      endDate: Date,
      isActive: Boolean,
      shuttles: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('ShuttleGroup', shuttleGroupSchema);