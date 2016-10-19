const config = require('./config.js');
var helpers = function() {
  this.isAdmin = function isAdmin(rcs_id) {
      var admins = config.admins;
      return (admins.indexOf(rcs_id) != -1);
      }
};

exports.helpers = helpers;