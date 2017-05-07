"use strict";
//include all required helper files
const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const ShuttleGroup = require("../schema/shuttle-group.js");
const helperLib = require("../helper.js").helpers;
const eventEmitter = require('../app').eventEmitter;
const helper = new helperLib();
module.exports = router;
router.get('/', (req, res) => {

	//checks if the user is logged in
	if (!req.session || !req.session.cas_user) {
		res.status(401);
		res.send("You must be logged in to complete this action.");
		return;
	}
	
	// Shuttle groups contain no particularly sensitve information, it's okay to send the same info to users and admins
	var query = ShuttleGroup.find({}).lean();
		query.exec((err, docs) => {
			res.send(docs);
		});
});