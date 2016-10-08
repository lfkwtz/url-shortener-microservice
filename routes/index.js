'use strict';

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
    let host = req.get('host');
    // check if exists, if it does - return document
    Link.findOne({
        url
    }).then(found => {
        if (found) {
          let obj = {
                original_url: found.url,
                short_url: `${host}/${found.short}`
                }
            res.status(200).json(obj);
        } else {
            helper.urlCheck(url, function(valid) {
                if (valid) {
                    let createLink = new Link({
                        url
                    });
                    createLink.save()
                        .then(newDoc => {
                          let obj = {
                                original_url: newDoc.url,
                                short_url: `${host}/${newDoc.short}`
                              };
                            res.status(200).json(obj);
                        });
                } else {
                    res.json({
                        error: 'Wrong url format, make sure you have a valid protocol and real site.'
                    });
                }
            })
        }
    })
});

router.get('/:short', (req, res, next) => {
    Link.findOne({ short: req.params.short }).then(found => {
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
