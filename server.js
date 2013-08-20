/*
// iMedia Solutions, LLC
// Author: Andrew JM Faria http://www.linkedin.com/in/myimedia
// MIT License http://opensource.org/licenses/MIT
*/
var redis = require('redis'),
    nano = require('nano')('http://localhost:5984'),
    couchVotes = nano.db.use('h3535votes'),
    couchTechTax = nano.db.use('techtax'),
    r = redis.createClient(),
    express = require('express'),
    app = express(),
    Twit = require('twit'),
    //already generated new key
    T = new Twit({
      consumer_key: '',
      consumer_secret: '',
      access_token: '',
      access_token_secret: ''
    }),
    techtax = T.stream('statuses/filter', {track : 'techtax'});

app.use(express.bodyParser());
//app.use(express.logger('dev'));
app.use(express.static(__dirname + '/app'));

techtax.on('tweet', function(tweet) {

  var hashes = tweet.entities.hashtags, i, vote;
  couchTechTax.insert(tweet); //store the entire tweet object

  for (i in hashes) {
    if(hashes[i].text.indexOf('vote') > -1) {
      vote = hashes[i].text.toString().toLowerCase();

      switch(vote){
        case 'voterepeal':
          r.incr('repeal');
          break;

        case 'voteinjunction':
          r.incr('injunction');
          break;

        default:
          break;
      }

    }else{
      r.incr('techtax');
    }
  }
  
});

app.get('/api/all', function(req,res) {
  r.mget(['repeal', 'injunction', 'techtax'], function(err,reply){
    res.send( JSON.stringify( {"repeal":reply[0],"injunction":reply[1], "techtax":reply[2]} ));
  });
});

app.get('/api/get/:vote', function(req, res) {
  r.get(req.params.vote, function(err, reply){
    res.send(reply);
  });
});

app.use(app.router);

app.listen(80);
