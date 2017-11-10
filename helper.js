"use strict";
const config = require('./config.js');
const cms = require('./cms.js');
var helpers = function() {
  this.isAdmin = function isAdmin(rcs_id) {
      var admins = process.env.ADMINS || config.admins;
      return (admins.indexOf(rcs_id) != -1);
      }
  this.getEmail = function(rcs_id) {
  	  var user_data = cms.getRCS(rcs_id);
  	  user_data = JSON.parse(user_data);
  	  return user_data.email;
  }
  this.getName = function(rcs_id) {
  	  var user_data = cms.getRCS(rcs_id);
  	  user_data = JSON.parse(user_data);
  	  return user_data.first_name;
  }
}

exports.helpers = helpers;