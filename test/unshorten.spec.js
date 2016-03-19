'use strict';

let expect = require('chai').expect;
let nock = require('nock');
let request = require('request');

let unshorten = require('../unshorten');

describe('unshorten', function() {
  beforeEach(function() {
    nock('http://t.co')
      .head('/short')
      .reply(301, null, { 'location': 'http://long.com/long' });
  });

  it('should expand a url', function(done) {
    nock('http://long.com')
      .head('/long')
      .reply(200);

    unshorten('http://t.co/short', function(error, url) {
      expect(url).to.equal('http://long.com/long');
      done();
    });
  });

  it('should follow multiple redirects', function(done) {
    nock('http://long.com')
      .head('/long')
      .reply(301, null, { 'location': 'http://longer.com/longer' });

    nock('http://longer.com')
      .head('/longer')
      .reply(200);

    unshorten('http://t.co/short', function(error, url) {
      expect(url).to.equal('http://longer.com/longer');
      done();
    });
  });
});
