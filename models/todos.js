const mongoose = require('mongoose');

const dataModel = require('../utils/schema/data');
const userModel = require('../utils/schema/user');


const ObjectId = mongoose.mongo.ObjectID;
exports.addNewData = function (obj) {
    console.log('model');
    var title = obj.title;
    var work = obj.work;
    var userId = obj.decodedToken.id;
    var email = obj.decodedToken.email;

    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email,
            _id: ObjectId(userId)
        }).then(user => {
            // console.log(user.data);
            var todo = new dataModel({
                title: title,
                todo: work,
                user: ObjectId(userId)
            });
            todo.save(function (err, result) {
                if (err) {
                    // console.log(err);
                    reject(['Data Model can\'t be created', err._message]);
                } else {
                    user.data.unshift(result._id);
                    user.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(['Cant save the data in the user', err._message]);
                        }
                        // console.log(result);
                    });
                    resolve({
                        data: result
                    });
                }
            });
        }).catch(err => {
            console.log(err);
            reject([err._message]);
        });
    });
}

exports.getUserList = function (obj) {
    var userId = obj.decodedToken.id;
    var email = obj.decodedToken.email;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email,
            _id: ObjectId(userId)
        }).then((user) => {
            resolve(user.data.populate('title'));
        }).catch(err => {
            reject(['Can\'t find the user', err._message]);
        })
    });
}