"use strict";
const express = require('express');
const app = require('../app').app;
const eventEmitter = require('../app').eventEmitter;
const expressWs = require('express-ws')(app);
module.exports = get_shuttles;

function get_shuttles(ws, req) {
    if (!req.session || !req.session.cas_user) {
        console.log("TEST");
		ws.send("You're not logged in.");
		return;
	}
	
    eventEmitter.on('websocket', (update) => {
        console.log(update);
        ws.send(update);
    });
};
