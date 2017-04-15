"use strict";
const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../schema/shuttle.js");
const helperLib = require("../helper.js").helpers;
const eventEmitter = require('../app').eventEmitter;
const helper = new helperLib();
module.exports = router;
router.post('/', function(req, res) {
	if (!req.session || !req.session.cas_user) {
		res.redirect("/login");
		return;
	}
	var rcs_id = req.session.cas_user.toLowerCase();
	var shuttleID = req.body.id;
	var numGuests = req.body.numGuests;
	var guestsOnly = req.body.guestsOnly;
	if (typeof numGuests !== "number" || typeof guestsOnly !== "boolean") {
		res.status(400);
		res.send("Your request appears to be malformed.");
		return;
	}
	var query = Shuttle.find({
		_id: shuttleID
	}).lean();
	
	// Remove unnecessary fields from the query for performance improvement
	query.select('riders');
	query.select('waitlist');
	query.select('vacancies');
	query.select('isActive');
	
	query.exec(function(err, docs) {
		if (err) {
			res.send("There was an error unsigning up for shuttle " + shuttleID);
		}
		// Assume that this is the only shuttle with this ID (again, if not, there are some serious issues)
		var shuttle = docs[0];
		// Mongoose doesn't always throw an error if given an ID for a shuttle that doesn't exist
		// This if-conditional fixes that
		if (shuttle === null) {
			res.send("That shuttle doesn't exist.");
			return;
		}
		var riders = shuttle.riders;
		var waitlist = shuttle.waitlist;
		var vacancies = shuttle.vacancies;
		if (!shuttle.isActive) {
			res.send("That shuttle is inactive.");
			return;
		}
		// Now, let's check to see if the user is even signed up for this shuttle
		if (riders.indexOf(rcs_id) === -1 && waitlist.indexOf(rcs_id) === -1) {
			res.send("You're not signed up for shuttle " + shuttleID);
			return;
		}
		// Let's handle if we're removing both a user and their guests (guestsOnly === false)
		// Also useful for removing an individual user from a shuttle
		
		if (!guestsOnly) {
			// Let's figure out if they're on the waitlist or if they're on the riders list
			if (riders.indexOf(rcs_id) !== -1) {
				for (var user = 0; user < riders.length; ++user) {
					if (riders[user].includes(rcs_id)) {
						riders.splice(user, 1);
						user--;
						vacancies++;
					}
				}
			}
			
			else {
				for (var user = 0; user < waitlist.length; ++user) {
					if (waitlist[user].includes(rcs_id)) {
						waitlist.splice(user, 1);
						user--;
					}
				}
			}
			
			Shuttle.findOneAndUpdate({
				_id: shuttleID
			}, {
				riders: riders,
				waitlist: waitlist,
				vacancies: vacancies
			}, function(err) {
				if (err) {
					res.send("There was an error removing you from the shuttle.");
					return;
				}
				res.send("You have been removed from shuttle " + shuttleID);
				var webSocketResponseAdmin = {type: "unsignup-shuttle", shuttle: [shuttleID, riders, waitlist, vacancies]};
				eventEmitter.emit('websocket-admin', JSON.stringify(webSocketResponseAdmin));
				var webSocketResponse = {type: "unsignup-shuttle", shuttle: [shuttleID, vacancies, waitlist.length]};
				eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
				return;
			});
		}

		// Okay, so let's now focus on only removing the number of guests provided (guestsOnly === true) 
		else {
			var guestsRemoved = 0;
			// Let's figure out if the guests are on the waitlist or the riders list
			if (riders.indexOf(rcs_id) !== -1) {
				for (var i = 0; i < numGuests; ++i) {
					for (var user = 0; user < riders.length; ++user) {
						if (riders[user].includes(rcs_id + "-guest")) {
							riders.splice(user, 1);
							user--;
							guestsRemoved++;
						}
					}
				}
			}

			else {
				for (var i = 0; i < numGuests; ++i) {
					for (var user = 0; user < riders.length; ++user) {
						if (riders[user].includes(rcs_id + "-guest")) {
							riders.splice(user, 1);
							user--;
							guestsRemoved++;
						}
					}
				}
			}

			Shuttle.findOneAndUpdate({
				_id: shuttleID
			}, {
				riders: riders,
				waitlist: waitlist,
				vacancies: vacancies
			}, function(err) {
				if (err) {
					res.send("There was an error removing your guests from the shuttle.");
					return;
				}
				res.send("Your " + guestsRemoved + " guests have been removed from shuttle " + shuttleID);
				var webSocketResponseAdmin = {type: "unsignup-shuttle", shuttle: [shuttleID, riders, waitlist, vacancies]};
				eventEmitter.emit('websocket-admin', JSON.stringify(webSocketResponseAdmin));
				var webSocketResponse = {type: "unsignup-shuttle", shuttle: [shuttleID, vacancies, waitlist.length]};
				eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
				return;
			});
		}
	});
});
