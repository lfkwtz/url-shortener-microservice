var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
});

var counter = mongoose.model('counter', CounterSchema);

var urlSchema = new Schema({
    _id: {type: Number, index: true},
    long_url: String,
    created_at: Date
});

// The pre('save', callback) middleware executes the callback function every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next){
    var doc = this;
    // find url_count and increment by 1
    counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
        if (error)
            return next(error);
        doc._id = counter.seq;
        doc.created_at = new Date();
        next();
    });
});

var Url = mongoose.model('Url', urlSchema);
module.exports = Url;