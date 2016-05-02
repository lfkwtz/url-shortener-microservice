var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

var shortid = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/newurl', function(req,res){
  res.render('newurl', {title: 'Add URL'});
});

router.post('/newurl', function(req,res){
  var MongoClient = mongodb.MongoClient

  var url = 'mongodb://localhost:27017/url2'

  MongoClient.connect(url, function(err, db){
    if (err){
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")

      var collection = db.collection('urls');

      var newUrl = {url: req.body.url, short: shortid.generate()};
      collection.insert([newUrl], function(err, result){
        if (err) {
          console.log(err);
        } else {
          res.render('index');
        }
        db.close();
      });
    }
  });
});

module.exports = router;
