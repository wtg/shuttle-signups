const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const helperLib = require("../helper.js").helpers;
const helper = new helperLib();
const Shuttle = require("../schema/shuttle.js");
module.exports = router;
router.get('/', function(req, res) {
  if (!req.session || !req.session.cas_user) {
    res.redirect("/login");
    return;
  }
  var rcs_id = req.session.cas_user.toLowerCase();
  // Allow admins to query a user's RCS id and get shuttles in which they're signed up.
  if (helper.isAdmin(rcs_id)) {
    if (req.query.user_rcs_id != null) {
      rcs_id = req.query.user_rcs_id;
    }
    var query = Shuttle.find({
      $or: [{
        'riders': rcs_id
      }, {
        'waitlist': rcs_id
      }]
    }).lean();
    query.exec(function(err, docs) {
      res.send(docs);
      return;
    });
  }
  else {
    var query = Shuttle.find({
      $or: [{
        'riders': rcs_id
      }, {
        'waitlist': rcs_id
      }]
    }).lean();

    // Remove unnecessary fields from the query for performance improvement
    query.select('riders');
    query.select('waitlist');
    query.select('guestsAllowed');

    query.exec(function(err, docs) {
      var response = [];
      for (var i in docs) {
        var numGuests = 0;
        var onWaitlist;
        // Let's first figure out if the user is on the waitlist or not
        // If the user isn't on the waitlist
        if (docs[i].waitlist.indexOf(rcs_id) == -1) {
          onWaitlist = false;
          for (var user in docs[i].riders) {
            if (docs[i].riders[user].includes(rcs_id + "-guest")) {
              numGuests++;
            }
          }
        }
        else {
          onWaitlist = true;
          for (var user in docs[i].waitlist) {
            if (docs[i].waitlist[user].includes(rcs_id + "-guest")) {
              numGuests++;
            }
          }
        }
        response.push({
          id: docs[i]._id,
          numGuests: numGuests,
          onWaitlist: onWaitlist
        });
      }
      res.contentType('application/json');
      res.send(JSON.stringify(response));
    });
  }
});
