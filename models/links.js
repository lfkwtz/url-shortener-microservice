const mongoose = require('mongoose');
const shortid = require('shortid');
// removes underscores and dashes from possible characterlist
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const urlSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true },
  short: String,
  visits: {type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

urlSchema.pre('save', function(next) {
  this.short = shortid.generate();
  next(this)
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
