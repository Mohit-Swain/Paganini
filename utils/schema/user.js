const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    userName: String,
    googleId: String,
    data: [{
        type: Schema.Types.ObjectId,
        ref: 'Data'
    }]
});

module.exports = mongoose.model('User', userSchema);