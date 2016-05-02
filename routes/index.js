var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var validUrl = require('valid-url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/new/:url(*)', function(req, res, next) {
  var MongoClient = mongodb.MongoClient

  var url = 'mongodb://localhost:27017/url2'

  MongoClient.connect(url, function(err, db){
    if (err){
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")
      
      var collection = db.collection('urls');
      var url = req.params.url;
      
      var local = req.get('host');
      
      var newLink = function(db, callback) {
            if (validUrl.isUri(url)){
              var short = shortid.generate();
              var newUrl = {url: url, short: short};
              collection.insert([newUrl]);
              res.json({original_url: url, short_url: local+'/'+short});
            } else {
              res.json({error: "Wrong url format, make sure you have a valid protocol and real site."});
            };
        };
      
      newLink(db, function() {
        db.close();
      });

    };
  });
});

router.get('/:short', function(req, res, next) {
  var MongoClient = mongodb.MongoClient

  var url = 'mongodb://localhost:27017/url2'

  MongoClient.connect(url, function(err, db){
    if (err){
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")
      
      var collection = db.collection('urls');
      var short = req.params.short;
            
      var findLink = function(db, callback) {
      collection.findOne( { "short": short }, {url: 1, _id: 0}, function(err, doc) {
      if (doc != null) {
        res.redirect(doc.url);
          } else {
            res.json({error: "No corresponding shortlink found in the database."});
          };
        });
      };
      
      findLink(db, function() {
        db.close();
      });

    };
  });
});

module.exports = router;
