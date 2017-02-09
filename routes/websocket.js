"use strict";
const express = require('express');
const app = require('../app').app;
const eventEmitter = require('../app').eventEmitter;
const expressWs = require('express-ws')(app);
module.exports = get_shuttles;

function get_shuttles(ws, req) {
    eventEmitter.on('websocket', function(update) {
        console.log(update);
        ws.send(update);
    });
};
