const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
var mongoose = require('mongoose');
var Shuttle = require("../schema/shuttle.js");
var helperLib = require("../helper.js").helpers;
const helper = new helperLib();

module.exports = router;

router.post('/', function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.send("You must be logged in to complete this action.");
    } 
   
   else {
      var rcs_id = req.session.cas_user.toLowerCase();
      if (helper.isAdmin(rcs_id)) {
         var shuttle = new Shuttle({
            destination: req.body.destination,
            origin: req.body.origin,
            isActive: req.body.isActive,
            dateTime: req.body.dateTime,
            riders: [],
            waitlist: []
         });
         
         shuttle.save(function (err) {
            if (err) {
               console.log("There was a problem saving a shuttle.");
               res.send("There was an error in saving your shuttle. We're looking into it.");
            }
            else {
               res.send("Shuttle was sucessfully saved.");
            }
         });
      }
      else {
         res.send("You don't seem authorized for this action.");
      }
   }
});