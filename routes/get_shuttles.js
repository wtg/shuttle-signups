const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
var mongoose = require('mongoose');
var Shuttle = require("../schema/shuttle.js");
var helperLib = require("../helper.js").helpers;
const helper = new helperLib();

module.exports = router;

router.get('/', function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect("/login");
    } 
   
   else {
      var rcs_id = req.session.cas_user.toLowerCase();
      if (helper.isAdmin(rcs_id)) {
         var query = Shuttle.find({});
         query.exec(function (err, docs){
            res.send(docs);
         });
      }
      
      else {
         var query = Shuttle.find({'isActive': true}).lean();
         // Ensure non-admin users cannot see other riders, nor the waitlist for a shuttle.
         query.select('-riders');
         query.select('-waitlist');
         query.exec(function (err, docs){
            res.send(docs);
         });
      }
   }
});