const express = require('express');
const router = express.Router();

const mongodb = require('mongodb');
const mLab = 'mongodb://' + process.env.dbHost + '/' + process.env.dbName;
const MongoClient = mongodb.MongoClient

const shortid = require('shortid');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const validUrl = require('valid-url');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        host: req.get('host')
    });
});

router.get('/new/:url(*)', (req, res, next) => {
    MongoClient.connect(mLab, (err, db) => {
        if (err) {
            console.log('Unable to connect to server', err);
        } else {
            console.log('Connected to server')

            let collection = db.collection('links');
            let params = req.params.url;

            let newLink = function(db, callback) {
                collection.findOne({
                    'url': params
                }, {
                    short: 1,
                    _id: 0
                }, (err, doc) => {
                    if (doc) {
                        console.log(req);
                        res.json({
                            original_url: params,
                            short_url: `${req.get('host')}/${doc.short}`
                        });
                    } else {
                        if (validUrl.isUri(params)) {
                            // if URL is valid, do this
                            let shortCode = shortid.generate();
                            let newUrl = {
                                url: params,
                                short: shortCode
                            };
                            collection.insert([newUrl]);
                            res.json({
                                original_url: params,
                                short_url: `${req.get('host')}/${shortCode}`
                            });
                        } else {
                            // if URL is invalid, do this
                            res.json({
                                error: 'Wrong url format, make sure you have a valid protocol and real site.'
                            });
                        };
                    };
                });
            };

            newLink(db, () => {
                db.close();
            });

        };
    });

});

router.get('/:short', (req, res, next) => {

    MongoClient.connect(mLab, (err, db) => {
        if (err) {
            console.log('Unable to connect to server', err);
        } else {
            console.log('Connected to server')

            let collection = db.collection('links');
            let params = req.params.short;

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

            findLink(db, () => {
                db.close();
            });

        };
    });
});

module.exports = router;
