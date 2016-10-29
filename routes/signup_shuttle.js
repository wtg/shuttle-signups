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
        res.redirect("/login");
    } 
   
   else {
      var rcs_id = req.session.cas_user.toLowerCase();
      var shuttleID = req.body.id;
      var numGuests = req.body.numGuests;
      
      var query = Shuttle.find({_id: shuttleID}).lean();
      
      query.exec(function (err, docs) {
         if (err) {
            res.send("There was an error signing up for shuttle " + shuttleID)
         }
         
         else {
            // Let's assume that this is the only shuttle with this ID (if not, we have issues).
            var shuttle = docs[0];
            
            // Let's check to make sure the shuttle is active.
            if (!shuttle.isActive) {
               res.send("This shuttle is inactive.");
            }
             
            else {
               // Great, they're not bringing guests.
               if (numGuests == 0) {

                  // Let's go ahead and add them to the list.
                  var riders = shuttle.riders;
                  var waitlist = shuttle.waitlist;
                  var vacancies = shuttle.vacancies;

                  // Let's make sure they're not already signed up for a shuttle.
                  if (riders.indexOf(rcs_id) != -1 || waitlist.indexOf(rcs_id) != -1) {
                         res.send("Hey, you've already signed up for shuttle " + shuttleID);
                  }

                  else {
                     // If the shuttle currently has a vacancy
                     if (vacancies >= 1) {
                        riders.push(rcs_id);
                        vacancies--;

                        Shuttle.findOneAndUpdate({_id: shuttleID}, {riders: riders, vacancies: vacancies}, function(err) {
                           if (err) {
                              console.log(err);
                              res.send("There was an error signing up for shuttle " + shuttleID);
                           }

                           else {
                              res.send("Hey, you're signed up for shuttle " + shuttleID);
                           }
                        });
                     }

                     // This means there aren't any vacancies on the shuttle
                     else {
                        waitlist.push(rcs_id);

                        Shuttle.findOneAndUpdate({_id: shuttleID}, {waitlist: waitlist}, function(err) {
                           if (err) {
                              res.send("There was an error adding you to the waitlist for shuttle " + shuttleID);
                           }

                           else {
                              res.send("You've been added to the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.length + " in line.");
                           }
                        });
                     }
                  }
               }
            }
         }
      });
   }
});