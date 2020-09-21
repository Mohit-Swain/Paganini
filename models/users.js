const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');

const userModel = require('../utils/schema/user');
const ObjectId = mongoose.mongo.ObjectID;

exports.addUser = function (user) {
    var name = user.name;
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email
        }, function (err, user) {
            if (user) {
                reject({
                    completed: false,
                    errors: ['The user email already exists']
                })
            } else {
                bcrypt.hash(password, 12).then(hashPassword => {
                    var newUser = new userModel({
                        userName: name,
                        email: email,
                        password: hashPassword
                    });
                    return newUser.save()
                }).then((res) => {
                    resolve({
                        completed: true,
                    })
                }).catch(err => {
                    reject({
                        completed: false,
                        errors: [err]
                    })
                })
            }
        });
    });
}

exports.check = function (user) {
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email
        }, function (err, user) {
            if (!user) {
                reject({
                    completed: false,
                    errors: ['The user email doesn\'t exists']
                });
            } else {
                bcrypt.compare(password, user.password).then(result => {
                    if (result) {
                        var token = jwt.sign({
                            id: user._id,
                            email: user.email
                        }, process.env.SECRET_KEY, {
                            expiresIn: 60 * 60
                        });
                        resolve({
                            completed: true,
                            token: token,
                            name: user.userName
                        });
                    } else {
                        reject({
                            completed: false,
                            errors: ['The Password Didn\'t match']
                        });
                    }
                }).catch(err => {
                    reject({
                        completed: false,
                        errors: [err]
                    })
                })
            }
        })
    });
}

exports.changePassword = function (obj) {
    var new_password = obj.new_password;
    var userId = obj.userId;
    var token = obj.token;
    console.log('model');
    console.log(new_password);
    console.log(userId);
    console.log(token);

    console.log(typeof userId);
    return new Promise(function (resolve, reject) {
        console.log("promise");
        userModel.findOne({
            _id: ObjectId(userId),
            resetToken: token,
            resetTokenExpiration: {
                $gte: Date.now()
            }
        }).then(user => {
            console.log("uer");
            if (!user) {
                reject(['Token is inValid try again']);
            } else {
                // change it
                console.log(user);
                bcrypt.hash(new_password, 12).then(hashPassword => {
                    user.password = hashPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.save();
                    resolve({})
                }).catch(err => {
                    console.log("err2");
                    console.log(err);
                    reject([err._message]);
                });;
            }
        }).catch(err => {
            console.log("err1");
            console.log(JSON.stringify(err));
            reject([err._message]);
        });

    });
}