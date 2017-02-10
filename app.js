"use strict";
//dependencies
const express = require('express');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const bodyParser = require('body-parser');
const CASAuthentication = require('cas-authentication');
const favicon = require('serve-favicon');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config.js');
const cms = require('./cms.js');
const fs = require('fs')
const app = express();
const expressWs = require('express-ws')(app);
const helperLib = require("./helper.js").helpers;
const helper = new helperLib();
module.exports = {
    app,
    eventEmitter
};

//configure mongoose to load a configurable mongo url , with backwards compatability for older configs
mongoose.Promise = global.Promise;
console.log("Running with mongodb url of: " + process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL || config.mongo_url || "mongodb://localhost/shuttle-signups");

app.use(session({
    secret: process.env.SESSION_SECRET || config.session_secret || 'super secret key',
    saveUninitialized: false, // don't create session until something stored
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Create a new instance of CASAuthentication.
const cas = new CASAuthentication({
    cas_url: process.env.CAS_URL || config.cas_url || 'https://cas-auth.rpi.edu/cas',
    service_url: process.env.SERVICE_URL || config.service_url,
    is_dev_mode: process.env.CAS_DEV_MODE || config.cas_dev_mode,
    dev_mode_user: process.env.CAS_DEV_MODE_USER || config.cas_dev_mode_user,
    dev_mode_info: {
        cas_user: process.env.CAS_DEV_MODE_USER || config.cas_dev_mode_user
    },
    cas_version: '2.0',
});
app.use(express.static('web'));
app.use(bodyParser.json())
app.use('/scripts', express.static('node_modules'));
app.use('/app', express.static('web/app'));
app.use(favicon(path.join(__dirname, '/web/assets/images', 'favicon.ico')));

//ROUTES
app.use('/api/current-user', require('./routes/current-user'));
app.use('/api/admin/add-shuttle', require('./routes/admin/add-shuttle'));
app.use('/api/admin/add-shuttle-group', require('./routes/admin/add-shuttle-group'));
app.use('/api/get-shuttles', require('./routes/get-shuttles'));
app.ws('/api/websocket', require('./routes/websocket'));
app.use('/api/get-user-shuttles', require('./routes/get-user-shuttles'));
app.use('/api/admin/cancel-shuttle', require('./routes/admin/cancel-shuttle'));
app.use('/api/admin/delete-shuttle', require('./routes/admin/delete-shuttle'));
app.use('/api/admin/modify-shuttle', require('./routes/admin/modify-shuttle'));
app.use('/api/signup-shuttle', require('./routes/signup-shuttle'));
app.use('/api/unsignup-shuttle', require('./routes/unsignup-shuttle'));

app.get('/login', cas.bounce, function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect('/logout');
    }

    res.redirect('/dashboard');
});

app.get('/dashboard', function(req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect('/login');
    }

    res.sendFile(__dirname + "/web/dashboard.html");
});

app.get('/logout', cas.logout);

// Catch 404s
app.use(function(req, res, next) {
    res.status = 404;

    // respond with html page
    if (req.accepts('html')) {
        res.sendFile(__dirname + "/web/404.html");
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
        return;
    }

    res.type('txt').send('Not found');
});

if (!(process.env.NODE_ENV == "development" ||
        process.env.NODE_ENV == "production")) {
    process.env.NODE_ENV = "production";
}
const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Listening on port ' + port);
    console.log('...in ' + process.env.NODE_ENV + ' mode.');

});
