var Twit = require('twit');

var T = new Twit({
  consumer_key: '9dA2vFEQTfpUX5XnvxUpqQ',
    consumer_secret: 'xZi2dzaqmI8jORHbkHYo1WzfkmmemLPmdIL0oI5VcdM',
    access_token: '19214433-4Bz8D8mVX9nUkSz4UazSsC2ku35tRgLqeXAATqY',
    access_token_secret: '2Z7TptTDvTTblxJJeHNGU2SEkgoZrD1yRdjETWCA'
}); 

var params = {
  q : 'techtax',
  count : 100,
  since_id : 367380267138175000
};

var stream = T.stream('statuses/filter', { track: '#techtax' });

stream.on('tweet', function(tweet) {
  console.log(tweet);
});

/*
T.get('search/tweets', params, function(err, reply) {
  console.log(JSON.stringify(reply));
});
*/
