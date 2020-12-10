const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var twitterSchema = new Schema({
    id : Number,
    userName: String,
    displayName: String,
    accessToken: String,
    refreshToken: String,
    userId:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('TwitterAccount', twitterSchema);