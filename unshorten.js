var request = require('request');

function unshorten(url, callback) {
  request({
    method: 'HEAD',
    url,
    followAllRedirects: true
  }, (error, response) => {
    if (error) {
      callback(error);
    } else {
      callback(null, response.request.href);
    }
  });
}

module.exports = unshorten;
