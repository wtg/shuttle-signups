const request = require('supertest');
const app = require('../app.js').app;
const assert = require('assert');
const config = require('../config.js');

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

  describe('GET /api/current-user', function() {
    it('Respond with JSON.', function(done) {
      request(app)
        .get('/api/current-user')
        .set('Cookie', [cookies])
        .expect(200)
        .end(function(err, res) {
          if (err || !res.ok) return done(err);
          done();
        });
    });
  });

  describe('GET /api/get-shuttles', function() {
    it('Respond with JSON.', function(done) {
      request(app)
        .get('/api/get-shuttles')
        .set('Cookie', [cookies])
        .expect(200)
        .end(function(err, res) {
          if (err || !res.ok) return done(err);
          done();
        });
    });
  });

  describe('GET /api/get-user-shuttles', function() {
    it('Respond with JSON.', function(done) {
      request(app)
        .get('/api/get-user-shuttles')
        .set('Cookie', [cookies])
        .expect(200)
        .end(function(err, res) {
          if (err || !res.ok) return done(err);
          done();
        });
    });
  });
});

describe('Functionalty tests', function() {
  describe('GET /api/current-user', function() {
      describe('Verify /api/current-user is correct', function() {
          it('Respond with the correct user.', function(done) {
            request(app)
              .get('/api/current-user')
              .set('Cookie', [cookies])
              .expect(200)
              .end(function(err, res) {
                if (err || !res.ok) return done(err);
                var username = process.env.CAS_DEV_MODE_USER || config.cas_dev_mode_user;
                username = username.toLowerCase();
                assert((res.body.username === username), 'Expected ' + username + ' but got ' + res.body.username);
                done();
              });
          });
        });
  });
});
