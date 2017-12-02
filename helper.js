"use strict";
const config = require('./config.js');
const cms = require('./cms.js');
var helpers = function() {
    this.isAdmin = function isAdmin(rcs_id) {
        var admins = process.env.ADMINS || config.admins;
        return (admins.indexOf(rcs_id) != -1);
    }
    this.getUserData = function(rcs_id) {
      return new Promise((resolve, reject) => {
            var user_data = cms.getRCS(rcs_id).then(function(user_data) {
                user_data = JSON.parse(user_data);
                resolve(user_data);
            })

        })
    }
}

exports.helpers = helpers;