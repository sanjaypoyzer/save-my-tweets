// Save my tweets!
//
// Declare the Twitter streaming API & other requires
var keys = require('./keys.js')

var Twitter = require('node-tweet-stream')
  , t = new Twitter({
    consumer_key: keys.twitterConsumerKey,
    consumer_secret: keys.twitterConsumerSecret,
    token: keys.twitterToken,
    token_secret: keys.twitterTokenSecret
  })

var fs = require('fs'); 

var tweets = require('./tweets.json'); // Script won't run if this file isn't valid JSON

// On receipt of tweet, do a thing
t.on('tweet', function (newTweet) { 
  // Loop through all the tweets
  for (i=0;i < tweets.length; i++) {
    // Check each id against the new tweet
    if (tweets[i].id !== newTweet.id) {
      found = false;
      console.log('tweet ' + tweets[i].id + ' is different. keep going.');
    }else if (tweets[i].id == newTweet.id){
      found = true;
      console.log('found it. not adding tweet');
      break;
    }
  }
  // if we can't find it, append it to the file
  if(!found){
    console.log('This is a new tweet! We now have '+tweets.length+' tweet(s).');
    tweets.push(newTweet);
    fs.writeFile('tweets.json', JSON.stringify(tweets), function (err) {
      if (err){
        console.log(err)    
      }
    });
  }
})

// General error checker
t.on('error', function (err) {
  console.log('Oh no')
})

// Filter tweets by...
t.track('pizza') // Change this to whatever you want using Twitter's API filters - https://dev.twitter.com/streaming/reference/post/statuses/filter