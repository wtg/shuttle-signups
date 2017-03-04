"use strict";
const express = require('express');
const app = require('../app').app;
const eventEmitter = require('../../app').eventEmitter;
const helperLib = require("../../helper.js").helpers;
const expressWs = require('express-ws')(app);
module.exports = get_shuttles;

function get_shuttles(ws, req) {
    
    if (!req.session || !req.session.cas_user) {
        console.log("TEST");
		ws.send("You're not logged in.");
		return;
	}
	
	var rcs_id = req.session.cas_user.toLowerCase();
	
	if (!(helper.isAdmin(rcs_id)) {
	    ws.send("You're not authorized to access this websocket connection.");
	    return;
	}
	
    eventEmitter.on('websocket-admin', function(update) {
        console.log(update);
        ws.send(update);
    });
};
