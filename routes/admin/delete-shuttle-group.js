"use strict";
//include all required helper files
const express = require('express');
const router = express.Router();
const cms = require('../../cms.js');
const mongoose = require('mongoose');
const ShuttleGroup = require("../../schema/shuttle-group.js");
const helperLib = require("../../helper.js").helpers;
const eventEmitter = require('../../app').eventEmitter;
const helper = new helperLib();
module.exports = router;
router.post('/', (req, res) => {

	//checks if the user is logged in
	if (!req.session || !req.session.cas_user) {
		res.status(401);
		res.send("You must be logged in to complete this action.");
		return;
	}
	var rcs_id = req.session.cas_user.toLowerCase();
	console.log(req.session);

	//checks if user is an administrator
	if (helper.isAdmin(rcs_id)) {
		
		// Before deleting the group, let start by deleting all shuttles from within the group
		shuttleGroupID = req.body.id;

		var shuttleGroup = new ShuttleGroup(shuttleGroupJSON);

		//saves the shuttle group to the database
		shuttleGroup.save((err) => {
			if (err) {
				console.log("There was a problem saving that shuttle group.");
				res.status(500);
				res.send("There was an error in saving your shuttle group.");
				return;
			}
			var webSocketResponse = {type: "delete_shuttle_group", shuttleGroup: shuttleGroupJSON};
			eventEmitter.emit('websocket-update', JSON.stringify(webSocketResponse));
			res.send("Shuttle group was sucessfully saved.");
			return;
		});
	} else {
		//if the user is not an admin, deny access
		res.status(403);
		res.send("You don't seem authorized for this action.");
	}
});