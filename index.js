'use strict';

let Twit = require('twit');
let fs = require('fs');
let unshorten = require('./unshorten');
let express = require('express');
let app = express();

let T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let stream = T.stream('statuses/sample', { language: 'en' });

let outputPath = 'user-links.csv';

let fstream = fs.createWriteStream(outputPath);

stream.on('tweet', function(tweet) {
  let urls = tweet.entities.urls;
  urls.forEach(function(url) {
    unshorten(url.expanded_url, function(err, url) {
      fstream.write(`${tweet.user.id_str}, ${url}\n`);
    });
  });
});

stream.on('error', function(error) {
  console.log(error);
});

app.get('/user-links.csv', function(req, res) {
  res.setHeader('Content-type', 'text/plain');
  let stream = fs.createReadStream(outputPath);
  stream.pipe(res);
});

app.listen(process.env.PORT || 3000);
