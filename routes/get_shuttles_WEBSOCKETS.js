const express = require('express');
const app = require('../app');
const expressWs = require('express-ws')(app);

module.exports = get_shuttles;
function get_shuttles(ws, res) {
    ws.on('message', function(msg) {
        console.log(msg);
        setTimeout(function(){ ws.send("RESPONSE") }, 500);
    });
    
    ws.on('close', function close() {
        expressWs.getWss().clients.forEach(function each(client) {
            client.send("HEY GUYS, SOMEONE LEFT.");
    });
        console.log("USER DISCONNECTED.");
    });
};
