var request = require('supertest');
var app = require('../app.js').app;
var assert = require('assert');

var cookies;

describe('Availability tests', function() {
  describe('GET /', function() {
    it('Respond with a webpage.', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  
  describe('GET /login', function() {
    it('Respond with a redirect.', function(done) {
      request(app)
        .get('/login')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done();
        });
    });
  });
});

describe('Functionalty tests', function () {
  describe('GET /api/current_user', function() {
    it('Respond with JSON.', function(done) {
      this.timeout(10000);
      request(app)
        .get('/api/current_user')
        .set('Cookie', [cookies])
        .end(function(err, res) {
          if (err || !res.ok) return done(err);
          done();
        });
    });
    
    it('Respond with the correct user.', function(done) {
      this.timeout(10000);
      request(app)
        .get('/api/current_user')
        .set('Cookie', [cookies])
        .end(function(err, res) {
          if (err || !res.ok) return done(err);
          var username = process.env.CAS_DEV_MODE_USER.toLowerCase();
          assert((res.body.username === username), 'Expected ' + username + ' but got ' + res.body.username);
          done();
        });
    });
  });
});

