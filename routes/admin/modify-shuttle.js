const express = require('express');
const router = express.Router();
const cms = require('../../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../../schema/shuttle.js");
const helperLib = require("../../helper.js").helpers;
const helper = new helperLib();
module.exports = router;
router.post('/', function(req, res) {
	//checks if the user is logged in
	if (!req.session || !req.session.cas_user) {
		res.status(401);
		res.send("You must be logged in to complete this action.");
	}
	else {
		var rcs_id = req.session.cas_user.toLowerCase();

		//checks if user is an admin
		if (helper.isAdmin(rcs_id)) {
			var shuttleID = req.body._id;
			
			if (!shuttleID) {
				res.status(400);
				res.send("You didn't specify the ID of the shuttle to be modified.");
			}

			Shuttle.findOne({
				_id: shuttleID
			}, function(err, shuttle) {
				// Let's check to see if the shuttles capacity can be lowered...
				if (req.body.maxCapacity < shuttle.maxCapacity) {
					if (!(shuttle.riders.length <= req.body.maxCapacity)) {
						res.send("This shuttle's capacity cannot be lowered. Doing so would remove riders.");
						return;
					}

					else {
						var newMaxCapacity = req.body.maxCapacity;
						var newVacancies = req.body.maxCapacity - shuttle.riders.length;
					}
				}

				shuttle.isActive = req.body.isActive;
				shuttle.origin = req.body.origin;
				shuttle.destination = req.body.destination;
				shuttle.departureDateTime = req.body.departureDateTime;
				shuttle.maxCapacity = newMaxCapacity || req.body.maxCapacity;
				shuttle.vacancies = newVacancies || req.body.vacancies;
				shuttle.guestsAllowed = req.body.guestsAllowed;
				shuttle.notes = req.body.notes;
				shuttle.riders = req.body.riders;
				shuttle.waitlist = req.body.waitlist;
				shuttle.group = req.body.group;
				

				shuttle.save(function(err) {
					if (err) {
						res.send("There was an error modifying the shuttle.");
						console.log(err);
					}
				});
			});
		}

		else {
			res.status(403);
			res.send("You don't seem authorized for this action.");
		}
	}
});
