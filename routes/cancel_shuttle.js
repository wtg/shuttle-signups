//include all required helper files
const express = require('express');
const router = express.Router();
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
		return;
	}
	var rcs_id = req.session.cas_user.toLowerCase();

	//checks if user is an administrator
	if (helper.isAdmin(rcs_id)) {
		var shuttleID = req.body.id;

		//if so, find the shuttle and change it to inactive
		Shuttle.findOneAndUpdate({
			_id: shuttleID
		}, {
			isActive: false
		}, function(err) {
			if (err) {
				res.send("There was an issue cancelling shuttle " + shuttleID);
				return;
			}
			res.send("Shuttle " + shuttleID + " sucessfully cancelled.");
			return;
		});
	} else {
	  //if the user is not an admin, deny access
      res.status(403);
	  res.send("You don't seem authorized for this action.");
  }
});