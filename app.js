//dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const app = express();

app.use(express.static('web'));
app.use('/scripts', express.static('node_modules'));
app.use('/app', express.static('web/app'));
app.use(favicon(path.join(__dirname, '/web/assets/images', 'favicon.ico')));

app.listen(3000, function () {
  console.log('Listening on port 3000.');
});