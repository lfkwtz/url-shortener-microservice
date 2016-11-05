const express = require('express');
const router = express.Router();
const config = require('../config')
const Link = require('../models/links');
const helper = require('../helper');

/* GET home page. */
router.get('/', (req, res, next) => {
    const host = req.get('host');
    res.render('index', {
        host
    });
});

router.get('/new/:url(*)', (req, res, next) => {
    const url = req.params.url;
    const host = req.get('host');
    // check if exists, if it does - return document
    Link.findOne({
        url
    }).then(found => {
        if (found) {
            const foundObj = {
                original_url: found.url,
                short_url: `${host}/${found.short}`
            }
            res.json(foundObj);
        } else {
            helper.urlCheck(url).then(() => {
                    let createLink = new Link({
                        url
                    });
                    createLink.save()
                        .then(newDoc => {
                            const newObj = {
                                original_url: newDoc.url,
                                short_url: `${host}/${newDoc.short}`
                            };
                            res.json(newObj);
                        });
                })
                .catch(err => {
                    res.json({
                        error: 'Wrong url format, make sure you have a valid protocol and real site.'
                    });
                })
        }
    })
});

router.get('/:short', (req, res, next) => {
    Link.findOneAndUpdate({
        short: req.params.short
    }, { $inc: { visits : 1 } }).then(found => {
        if (found) {
            res.redirect(found.url);
        } else {
            res.json({
                error: 'No corresponding shortlink found in the database.'
            })
        }
    })
});

module.exports = router;
