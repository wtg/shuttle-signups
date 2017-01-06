var request = require('supertest');
var app = require('../app.js').app

describe('Functionality tests', function() {
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
});

