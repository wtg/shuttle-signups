//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const CASAuthentication = require('cas-authentication');
const favicon = require('serve-favicon');
const session = require('express-session');
const NedbStore = require('connect-nedb-session')(session);
const path = require('path');
const config = require('./config.js');
const cms = require('./cms.js');
const app = express();
const sessionStore = new NedbStore({ filename: config.session_persistence_file });

app.use(session({
    secret: process.env.SESSION_SECRET || 'super secret key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// Create a new instance of CASAuthentication.
const cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: config.service_url,
    cas_version: '2.0',
});

app.use('/scripts', express.static('node_modules'));
app.use('/app', express.static('web/app'));
app.use(favicon(path.join(__dirname, '/web/assets/images', 'favicon.ico')));


//ROUTES
app.get('/', function (req, res, next) {
   if (req.session.cas_user) {
      res.redirect('/dashboard');
   }
   
   else {
      app.use(express.static('web'));
      next();
   }
});

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
   var rcs_id = req.session.cas_user.toLowerCase();
    cms.getRCS(rcs_id).then(function (user_data) {
       user_data = JSON.parse(user_data);
       var first_name = user_data.preferred_name || user_data.first_name;
       // username, student_id (is rin), last_name, middle_name, user_type
       res.send( '<html><body><a href = "/logout">Hello ' + first_name + '!</a></body></html>' );
   });
});

app.get('/logout', cas.logout);

app.listen(3000, function () {
  console.log('Listening on port 3000.');
});