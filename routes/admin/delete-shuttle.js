"use strict";
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

	//checks if the user is an admin
	if (helper.isAdmin(rcs_id)) {
		var shuttleID = req.body.id;
		//find and remove shuttle from database
		Shuttle.findOneAndRemove({
			_id: shuttleID
		}, function(err) {
			if (err) {
				res.send("There was an issue deleting shuttle " + shuttleID);
				return;
			}
			var webSocketResponse = {type: "delete", shuttleID: shuttleID};
			eventEmitter.emit('websocket', JSON.stringify(webSocketResponse));
			res.send("Shuttle " + shuttleID + " sucessfully deleted.");
			return;
		});
	} else {
	  //deny access if not an admin
      res.status(403);
	  res.send("You don't seem authorized for this action.");
  }
});