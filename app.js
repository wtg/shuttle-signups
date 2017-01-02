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
module.exports = {app, eventEmitter};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/shuttle-signups');

app.use(session({
    secret: process.env.SESSION_SECRET || 'super secret key',
    saveUninitialized: false, // don't create session until something stored
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Create a new instance of CASAuthentication.
const cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: process.env.SERVICE_URL || config.service_url,
    cas_version: '2.0',
});

app.use(express.static('web'));
app.use(bodyParser.json())
app.use('/scripts', express.static('node_modules'));
app.use('/app', express.static('web/app'));
app.use(favicon(path.join(__dirname, '/web/assets/images', 'favicon.ico')));

//ROUTES
app.use('/api/current_user', require('./routes/current_user'));
app.use('/api/add_shuttle', require('./routes/add_shuttle'));
app.use('/api/get_shuttles', require('./routes/get_shuttles'));
app.ws('/api/get_shuttles', require('./routes/get_shuttles_WEBSOCKETS'));
app.use('/api/get_user_shuttles', require('./routes/get_user_shuttles'));
app.use('/api/cancel_shuttle', require('./routes/cancel_shuttle'));
app.use('/api/delete_shuttle', require('./routes/delete_shuttle'));
app.use('/api/modify_shuttle', require('./routes/modify_shuttle'));
app.use('/api/signup_shuttle', require('./routes/signup_shuttle'));
app.use('/api/unsignup_shuttle', require('./routes/unsignup_shuttle'));

app.get('/login', cas.bounce, function (req, res) {
   if (!req.session || !req.session.cas_user) {
        res.redirect('/logout');
   }

   res.redirect('/dashboard');
});

app.get('/dashboard', function (req, res) {
   if (!req.session || !req.session.cas_user) {
        res.redirect('/login');
   }

   res.sendFile( __dirname + "/web/dashboard.html" );
});

app.get('/logout', cas.logout);

// Catch 404s
app.use(function (req, res, next) {
    res.status = 404;

   // respond with html page
   if (req.accepts('html')) {
      res.sendFile(__dirname + "/web/404.html");
      return;
   }

   // respond with json
   if (req.accepts('json')) {
       res.send({ error: 'Not found' });
       return;
   }

   res.type('txt').send('Not found');
});

if(!(process.env.NODE_ENV == "development" ||
    process.env.NODE_ENV == "production")){
    process.env.NODE_ENV = "production";
}
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  console.log('...in ' + process.env.NODE_ENV + ' mode.');

});
