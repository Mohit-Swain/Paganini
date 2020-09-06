const mongoose = require('mongoose');

var userInfoSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
});

module.exports = userInfoSchema;