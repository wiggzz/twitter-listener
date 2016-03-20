'use strict';

let request = require('request');

let defaultOptions = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'
};

function extractOptions(options) {
  return Object.assign({}, defaultOptions, options);
}

function unshorten(url, options, callback) {
  if (!callback) {
    callback = options;
    options = {}
  }

  options = extractOptions(options);

  request({
    method: 'HEAD',
    url,
    followAllRedirects: true,
    headers: {
      'User-Agent': options.userAgent
    }
  }, (error, response) => {
    if (error) {
      callback(error);
    } else {
      callback(null, response.request.href);
    }
  });
}

module.exports = unshorten;
