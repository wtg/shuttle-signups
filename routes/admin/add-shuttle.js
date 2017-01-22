//include all required helper files
const express = require('express');
const router = express.Router();
const cms = require('../../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../../schema/shuttle.js");
const helperLib = require("../../helper.js").helpers;
const eventEmitter = require('../../app').eventEmitter;
const helper = new helperLib();
module.exports = router;
router.post('/', function(req, res) {

	//checks if the user is logged in
	if (!req.session || !req.session.cas_user) {
		res.status(401);
		res.send("You must be logged in to complete this action.");
		return;
	}
	var rcs_id = req.session.cas_user.toLowerCase();

	//checks if user is an administrator
	if (helper.isAdmin(rcs_id)) {
		//if so, create the new shuttle from json
		var shuttleJSON = {
			isActive: req.body.isActive,
			origin: req.body.origin,
			destination: req.body.destination,
			departureDateTime: req.body.departureDateTime,
			maxCapacity: req.body.maxCapacity,
			vacancies: req.body.maxCapacity,
			guestsAllowed: req.body.guestsAllowed,
			notes: req.body.notes,
			riders: [],
			waitlist: [],
			group: req.body.group
		}
		
		var shuttle = new Shuttle(shuttleJSON);

		//saves the shuttle to the database
		shuttle.save(function(err) {
			if (err) {
				console.log("There was a problem saving a shuttle." + err);
				res.status(500);
				res.send("There was an error in saving your shuttle. We're looking into it.");
				return;
			}
			var webSocketResponse = {type: "add_shuttle", shuttle: shuttleJSON};
			eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
			res.send("Shuttle was sucessfully saved.");
			return;
		});
	} else {
		//if the user is not an admin, deny access
		res.status(403);
		res.send("You don't seem authorized for this action.");
	}
});