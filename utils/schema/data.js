const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    title: String,
    todo: [{
        name: String,
        done: Boolean
    }],
    expiry: Date,
    isShared: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    twitterPostId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Data', dataSchema);