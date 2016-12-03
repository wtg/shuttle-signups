const feathers = require('feathers');
const router = feathers.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../schema/shuttle.js");
const helperLib = require("../helper.js").helpers;
const helper = new helperLib();
module.exports = router;
router.post('/', function(req, res) {
	//checks if the user is logged in
	if (!req.session || !req.session.cas_user) {
		res.status(401);
		res.send("You must be logged in to complete this action.");
	} else {
		var rcs_id = req.session.cas_user.toLowerCase();

		//checks if user is an admin
		if (helper.isAdmin(rcs_id)) {
			var shuttleID = req.body.id;
			//modify the given shuttle
			Shuttle.findOneAndUpdate({
				_id: shuttleID
			}, function(err) {
				//to be finished
				/*
				origin: req.body.origin,
				destination: req.body.destination,
				departureDate: req.body.dateTime,
				// I guess the size of a shuttle can change, but I'll have to think about how to handle a shuttle losing capacity.
				maxCapacity: req.body.maxCapacity,
				vacancies: req.body.maxCapacity,
				// I don't want to kick guests off if they were originally allowed
				guestsAllowed: req.body.guestsAllowed,
				*/
			})
		} else {
			res.status(403);
			res.send("You don't seem authorized for this action.");
		}
	}
});