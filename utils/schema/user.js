const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    userName: String,
    googleId: {
        type: String,
        default: undefined
    },
    data: [{
        type: Schema.Types.ObjectId,
        ref: 'Data'
    }],
    resetToken: String,
    resetTokenExpiration: Date,
    twitterAccount: {
        type: Schema.Types.ObjectId,
        ref: 'TwitterAccount',
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);