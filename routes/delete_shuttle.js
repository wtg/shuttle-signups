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
         var shuttleID = req.body.id;
         
         Shuttle.findOneAndRemove({_id: shuttleID}, function (err){
            if (err) {
               res.send("There was an issue deleting shuttle " + shuttleID);
            }
            else {
               res.send("Shuttle " + shuttleID + " sucessfully deleted.");
            }
            
         });
      
      }
      
      else {
         res.send("You don't seem authorized for this action.");
      }
   }
});