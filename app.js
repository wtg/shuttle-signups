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

app.use(session({
    secret: process.env.SESSION_SECRET || 'super secret key',
    resave: false,
    saveUninitialized: true,
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: config.service_url,
    cas_version: '2.0',
});

app.get('/login', cas.bounce, function (req, res) {
   if (!req.session || !req.session.cas_user) {
        res.redirect('/logout');
    }
   
   var rcs_id = req.session.cas_user.toLowerCase();
   res.send( '<html><body><a href = "/logout">Hello ' + rcs_id + '!</a></body></html>' );
   console.log(rcs_id);
});

app.get('/logout', cas.logout);

app.listen(3000, function () {
  console.log('Listening on port 3000.');
});