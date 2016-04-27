'use strict'

// require and instantiate express
var express = require('express');
var app = express();

// require and instantiate mongoose
var mongoose = require('mongoose');

var config = require('./config');
var base = require('./base.js');

// use Url model
var Url = require('./models/url');

// connect to mongo database
mongoose.connect('mongodb://localhost:27017/url-shortener-microservice');

//set jade to view engine and set view folder
app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

// serve index.html to root
app.get('/', function(req, res){
    res.render('index');
});

app.post('/api/shorten/:link', function(req, res){
  var longUrl = req.params.link;
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // base58 encode the unique _id of that document and construct the short URL
      shortUrl = config.webhost + base.encode(doc._id);

      // since the document exists, we return it without creating a new entry
      res.json({ 'short_url': shortUrl });
    } else {
      // The long URL was not found in the long_url field in our urls
      // collection, so we need to create a new entry:
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        // construct the short URL
        shortUrl = config.webhost + base.encode(newUrl._id);

        res.json({ 'short_url': shortUrl });
      });
    }

  });

});

app.get('/:encoded_id', function(req, res){
  var baseId = req.params.encoded_id;
  var id = base.decode(baseId);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      // nothing found -- go home
      res.redirect(config.webhost);
    }
  });

});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
   console.log('Sever listening on port ' + port); 
});