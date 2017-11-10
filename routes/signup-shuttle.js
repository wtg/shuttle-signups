"use strict";
const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
const handlebars = require('handlebars')
const mongoose = require('mongoose');
const Shuttle = require("../schema/shuttle.js");
const helperLib = require("../helper.js").helpers;
const eventEmitter = require('../app').eventEmitter;
const moment = require('moment');
const fs = require("fs");
const nodemailer = require("nodemailer");
const config = require('../config.js');
const replaceHTML = require('../email_templates/edit-template.js');
const helper = new helperLib();

module.exports = router;

var readHTML = function(filePath,time,location,rcs_id,callback) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(error, html) {
        if(error) {
            throw error;
            callback(error);
        }
        else {
            callback(null, html);
        }
    });
};

function emailuser(emailOptions) {
	let transporter = nodemailer.createTransport({
		host: config.emailHost,
		port: 587,
		secure: false,
		auth: {
			user: config.emailUsername,
			pass: config.emailPassword
		}
	});

	// send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
}

router.post('/', (req, res) => {
	if (!req.session || !req.session.cas_user) {
		res.redirect("/login");
		return;
	}
	var rcs_id = req.session.cas_user.toLowerCase();
	var shuttleID = req.body.id;
	var numGuests = req.body.numGuests;
	var guestsOnly = req.body.guestsOnly;
	// Now let's do some basic validation of the request body
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
	query.select('departureDateTime');
	query.select('destination');

	query.exec((err, docs) => {
		if (err) {
			res.send("There was an error signing up for shuttle " + shuttleID);
			return;
		}
		// Let's assume that this is the only shuttle with this ID (if not, we have issues).
		var shuttle = docs[0];
		if (shuttle === null) {
			res.send("That shuttle doesn't exist.");
			return;
		}
		var riders = shuttle.riders;
		var waitlist = shuttle.waitlist;
		var vacancies = shuttle.vacancies;
		var time = shuttle.departureDateTime.toString();
		var destination = shuttle.destination;
		; 
		// Let's check to make sure the shuttle is active.
		if (!shuttle.isActive) {
			res.send("This shuttle is inactive.");
			return;
		}
		// Let's check to ensure it has not passed the admin defined close-signup date and time
		if (moment(Date).isSameOrAfter(shuttle.closeSignup)) {
			res.send("Signups for this shuttle have ended.");
			return;
		}

		// Great, they're not bringing guests.
		if (numGuests === 0) {
			// Let's go ahead and add them to the list
			// Let's make sure they're not already signed up for a shuttle.
			if (riders.indexOf(rcs_id) !== -1) {
				res.send("You've already signed up for shuttle " + shuttleID);
				return;
			}
			else if (waitlist.indexOf(rcs_id) !== -1) {
				res.send("You're already on the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.indexOf(rcs_id) + " in line.");
				return;
			}
			// If the shuttle currently has a vacancy
			if (vacancies >= 1) {
				riders.push(rcs_id);
				vacancies--;
				Shuttle.findOneAndUpdate({
					_id: shuttleID
				}, {
					riders: riders,
					vacancies: vacancies
				}, (err) => {
					if (err) {
						console.log(err);
						res.send("There was an error signing up for shuttle " + shuttleID);
						return;
					}
					res.send("OK, you're signed up for shuttle " + shuttleID);
					var webSocketResponseAdmin = { type: "signup-shuttle", shuttle: [shuttleID, riders, vacancies] };
					eventEmitter.emit('websocket-admin', JSON.stringify(webSocketResponseAdmin));
					var webSocketResponse = { type: "signup-shuttle", shuttle: [shuttleID, vacancies] };
					eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
					var htmlToSend = "";
					// fs.readFile(__dirname + "/NotificationEmail.html","utf8", function(err, data) {
					// 	if(err) throw err;
					
					htmlToSend = readHTML(__dirname + '/NotificationEmail.html',time,destination,rcs_id, function(error,html) {
					    var template = handlebars.compile(html);
					    time = moment(time).utcOffset(-5).format("dddd, MMMM Do YYYY, h:mm a");
					    var replacements = { NAME: rcs_id, TIMEVAR: time, LOCVAR: destination};
					    var completeHTML = template(replacements);
					    console.log(completeHTML.toString());
					    var mailOptions = { // sender address
						to: 'stephendzialo7@gmail.com', // list of receivers
						subject: 'Shuttle Signup Confirmation', // Subject line
						html: completeHTML.toString() // html body
					};
					    emailuser(mailOptions);
					});
					
					return;
				});
			}

			else {
				// This means there aren't any vacancies on the shuttle
				waitlist.push(rcs_id);
				Shuttle.findOneAndUpdate({
					_id: shuttleID
				}, {
					waitlist: waitlist
				}, (err) => {
					if (err) {
						res.send("There was an error adding you to the waitlist for shuttle " + shuttleID);
						return;
					}
					res.send("You've been added to the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.length + " in line.");
					var webSocketResponseAdmin = { type: "signup-shuttle-waitlist", shuttle: [shuttleID, waitlist] };
					eventEmitter.emit('websocket-admin', JSON.stringify(webSocketResponseAdmin));
					var webSocketResponse = { type: "signup-shuttle-waitlist", shuttle: [shuttleID, waitlist.length] };
					eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
					return;
				});
			}
		}
		// ... They're bringing guests (or at least have indicated their willingness to do so)
		else if (numGuests > 0) {
			if (riders.indexOf(rcs_id) !== -1) {
				res.send("You've already signed up for shuttle " + shuttleID + ". To add guests, you'll need to unsignup, and then resignup with your guests.");
				return;
			}
			else if (waitlist.indexOf(rcs_id) !== -1) {
				res.send("You're already on the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.indexOf(rcs_id) + " in line.");
				return;
			}
			// Let's check to see if guests are even allowed
			if (shuttle.guestsAllowed === 0) {
				res.send("Guests aren't allowed on this shuttle.");
				return;
			}
			// Check to make sure the waitlist doesn't have riders on it (this will fix the condition explained by JCBird1012 in issue #3 on the repo)
			if (waitlist.length > 0) {
				res.send("This shuttle has a waitlist. Guests aren't allowed when a shuttle has an outstanding waitlist.");
				return;
			}
			else if (vacancies < numGuests + 1) {
				res.send("There isn't enough room on this shuttle.");
				return;
			}

			riders.push(rcs_id);
			vacancies--;

			// Not sure if I like this formatting.
			// Currently, a guest is formatted like: RCSID-guest#
			for (var i = 0; i < numGuests; i++) {
				riders.push(rcs_id + "-guest" + i);
				vacancies--;
			}
			Shuttle.findOneAndUpdate({
				_id: shuttleID
			}, {
				riders: riders,
				vacancies: vacancies
			}, (err) => {
				if (err) {
					res.send("There was an error adding your guests and you to the shuttle " + shuttleID);
					return;
				}
				res.send("Your " + numGuests + " guests and you have signed up for shuttle " + shuttleID);
				var webSocketResponseAdmin = { type: "signup-shuttle", shuttle: [shuttleID, riders, vacancies] };
				eventEmitter.emit('websocket-admin', JSON.stringify(webSocketResponseAdmin));
				var webSocketResponse = { type: "signup-shuttle", shuttle: [shuttleID, vacancies] };
				eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
				return;
			});
		}
	});
});
