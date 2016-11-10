const express = require('express');
const router = express.Router();
const cms = require('../cms.js');
const mongoose = require('mongoose');
const Shuttle = require("../schema/shuttle.js");
const helperLib = require("../helper.js").helpers;
const helper = new helperLib();

module.exports = router;

router.post('/', function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect("/login");
    } else {
        var rcs_id = req.session.cas_user.toLowerCase();
        var shuttleID = req.body.id;
        var numGuests = req.body.numGuests;

        var query = Shuttle.find({
            _id: shuttleID
        }).lean();

        query.exec(function(err, docs) {
            if (err) {
                res.send("There was an error signing up for shuttle " + shuttleID)
            } else {
                // Let's assume that this is the only shuttle with this ID (if not, we have issues).
                var shuttle = docs[0];

                if (shuttle == null) {
                    res.send("That shuttle doesn't exist.")
                } else {
                    var riders = shuttle.riders;
                    var waitlist = shuttle.waitlist;
                    var vacancies = shuttle.vacancies;

                    // Let's check to make sure the shuttle is active.
                    if (!shuttle.isActive) {
                        res.send("This shuttle is inactive.");
                    } else {
                        // Great, they're not bringing guests.
                        if (numGuests === 0) {

                            // Let's go ahead and add them to the list
                            // Let's make sure they're not already signed up for a shuttle.
                            if (riders.indexOf(rcs_id) != -1) {
                                res.send("Hey, you've already signed up for shuttle " + shuttleID);
                            } else if (waitlist.indexOf(rcs_id) != -1) {
                                res.send("Hey, you're already on the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.indexOf(rcs_id) + " in line.");
                            } else {
                                // If the shuttle currently has a vacancy
                                if (vacancies >= 1) {
                                    riders.push(rcs_id);
                                    vacancies--;

                                    Shuttle.findOneAndUpdate({
                                        _id: shuttleID
                                    }, {
                                        riders: riders,
                                        vacancies: vacancies
                                    }, function(err) {
                                        if (err) {
                                            console.log(err);
                                            res.send("There was an error signing up for shuttle " + shuttleID);
                                        } else {
                                            res.send("Hey, you're signed up for shuttle " + shuttleID);
                                        }
                                    });
                                }

                                // This means there aren't any vacancies on the shuttle
                                else {
                                    waitlist.push(rcs_id);

                                    Shuttle.findOneAndUpdate({
                                        _id: shuttleID
                                    }, {
                                        waitlist: waitlist
                                    }, function(err) {
                                        if (err) {
                                            res.send("There was an error adding you to the waitlist for shuttle " + shuttleID);
                                        } else {
                                            res.send("You've been added to the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.length + " in line.");
                                        }
                                    });
                                }
                            }
                        }

                        // ... They're bringing guests (or at least have indicated their willingness to do so)
                        else if (numGuests > 0) {
                            if (riders.indexOf(rcs_id) != -1) {
                                res.send("Hey, you've already signed up for shuttle " + shuttleID);
                            } else if (waitlist.indexOf(rcs_id) != -1) {
                                res.send("Hey, you're already on the waitlist for shuttle " + shuttleID + ". You're currently number " + waitlist.indexOf(rcs_id) + " in line.");
                            }
                            // Let's check to see if guests are even allowed
                            else {
                                if (shuttle.guestsAllowed === 0) {
                                    res.send("Guests aren't allowed on this shuttle.");
                                } else {
                                    // Check to make sure the waitlist doesn't have riders on it (this will fix the condition explained by JCBird1012 in issue #3 on the repo)
                                    if (waitlist.length > 0) {
                                        res.send("This shuttle has a waitlist. Guests aren't allowed when a shuttle has an outstanding waitlist.");
                                    } else if (vacancies < numGuests) {
                                        res.send("There isn't enough room on this shuttle for your guest and you.")
                                    } else {
                                        riders.push(rcs_id);
                                        vacancies--;
                                        // Not sure if I like this formatting.
                                        for (var i = 0; i < numGuests; i++) {
                                            riders.push(rcs_id + "-guest" + i);
                                            vacancies--;
                                        }

                                        Shuttle.findOneAndUpdate({
                                            _id: shuttleID
                                        }, {
                                            riders: riders,
                                            vacancies: vacancies
                                        }, function(err) {
                                            if (err) {
                                                res.send("There was an error adding you and your guests to the waitlist for shuttle " + shuttleID);
                                            } else {
                                                res.send("Your " + numGuests + " guests and you have signed up for shuttle " + shuttleID);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

            }
        });
    }
});