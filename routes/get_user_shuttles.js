const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
var mongoose = require('mongoose');
var Shuttle = require("../schema/shuttle.js");

module.exports = router;

router.get('/', function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect("/login");
    } 
   
   else {
      var rcs_id = req.session.cas_user.toLowerCase();
      
      var query = Shuttle.find({$or : [{'riders': rcs_id}, {'waitlist': rcs_id}]}).lean();
      query.exec(function (err, docs){
         res.send(docs);
      });
   }
});