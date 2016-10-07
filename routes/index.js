const express = require('express');
const router = express.Router();
const config = require('../config')
const Link = require('../models/links');
const helper = require('../helper');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        host: req.get('host')
    });
});

router.get('/new/:url(*)', (req, res, next) => {
  let url = req.params.url;
  // check if exists, if it does - return document
  Link.findOne({ url }).then(found => {
    if (found) {
      res.status(200).send(found);
    } else {
      console.log('not found')
      helper.urlCheck(url, function(valid) {
        if (valid) {
          let createLink = new Link({ url });
          createLink.save()
          .then(newDoc => {
            // res.json({
            //     original_url: params,
            //     short_url: `${req.get('host')}/${shortCode}`
            // });
            res.status(200).send(newDoc);
          });
        } else {
          res.json({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
        }
      })
    }
  })
});

router.get('/:short', (req, res, next) => {
  let shorty = req.params.short;
  Link.findOne({})
    let findLink = function(db, callback) {
        collection.findOne({
            'short': params
        }, {
            url: 1,
            _id: 0
        }, (err, doc) => {
            doc ?
                res.redirect(doc.url) :
                res.json({
                    error: 'No corresponding shortlink found in the database.'
                })
        });
            };
        };
    });
});

module.exports = router;
