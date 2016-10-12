//dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CASAuthentication = require('cas-authentication');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
var config = require('./config.js');
const app = express();

app.use(express.static('web'));
app.use('/scripts', express.static('node_modules'));
app.use('/app', express.static('web/app'));
app.use(favicon(path.join(__dirname, '/web/assets/images', 'favicon.ico')));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: config.service_url,
    cas_version: '2.0',
    is_dev_mode: config.cas_dev_mode,
    dev_mode_user: config.cas_dev_mode_user
});

app.get('/login', cas.bounce, function (req, res) {
    if (!req.session || !req.session.cas_user) {
        res.redirect('/logout');
    }
});

app.listen(3000, function () {
  console.log('Listening on port 3000.');
});