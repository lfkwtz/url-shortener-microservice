'use strict';

const validUrl = require('valid-url');

exports.urlCheck = function(url, callback) {
  if (validUrl.isUri(url)) {
    callback(true);
  } else {
    callback(false);
  }
}
