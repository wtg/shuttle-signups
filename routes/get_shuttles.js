const feathers = require('feathers');
const router = feathers.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../schema/shuttle.js");
const helperLib = require("../helper.js").helpers;
const helper = new helperLib();
module.exports = router;
router.get('/', function(req, res) {

	//checks if user is logged in
	if (!req.session || !req.session.cas_user) {
		res.redirect("/login");
		return;
	}

	var rcs_id = req.session.cas_user.toLowerCase();
	//if the user is an admin
	if (helper.isAdmin(rcs_id)) {
		//query the database and return all information on all shuttles
		var query = Shuttle.find({}).lean();
		query.exec(function(err, docs) {

			res.send({"data":docs});
		});
	} else {
		var query = Shuttle.find({}).lean();
		// Ensure non-admin users cannot see other riders, nor the waitlist for a shuttle.
		query.select('-riders');
		query.select('-waitlist');
		query.exec(function(err, docs) {
			res.send(docs);
		});
	}
});
