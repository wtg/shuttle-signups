const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
var helperLib = require("../helper.js").helpers;
const helper = new helperLib();

module.exports = router;

router.post('/', function(req, res) {
      var rcs_id = req.session.cas_user.toLowerCase();
      if (helper.isAdmin(rcs_id)) {
         var destination = req.body.destination;
         var origin = req.body.origin;
         var isActive = req.body.isActive;
         var dateTime = req.body.dateTime
         res.send(destination.name  + " " + origin.name);
         
      }
      else {
         res.send("You don't seem authorized for this action.");
      }
});