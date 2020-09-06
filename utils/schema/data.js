const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    plan: [{
        name: String,
        completed: Boolean
    }],
    expiry: Date,
    isShared: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Data', dataSchema);