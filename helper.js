const validUrl = require('valid-url');

exports.urlCheck = function(url) {
  return new Promise((resolve, reject) => {
    if (validUrl.isUri(url)) {
      resolve(true);
    } else {
      reject(false);
    }
  })
}
