const mongoose = require('mongoose');
const shortid = require('shortid');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  url: { type: String, unique: true, required: true },
  short: String,
  created_at: { type: Date, default: Date.now }
});

urlSchema.pre('save', function(next) {
  this.short = shortid.generate();
  next(this)
});

var Url = mongoose.model('Url', urlSchema);
module.exports = Url;
