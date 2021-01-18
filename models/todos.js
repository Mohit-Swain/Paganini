const mongoose = require('mongoose');

const dataModel = require('../utils/schema/data');
const userModel = require('../utils/schema/user');


const ObjectId = mongoose.mongo.ObjectID;
exports.addNewData = function (obj) {
    var title = obj.title;
    var work = obj.work;
    var userId = obj.id;
    var email = obj.email;

    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email,
            _id: ObjectId(userId)
        }).then(user => {
            var todo = new dataModel({
                title: title,
                todo: work,
                user: ObjectId(userId)
            });
            todo.save(function (err, result) {
                if (err) {
                    reject(['Data Model can\'t be created', err._message]);
                } else {
                    user.data.unshift(result._id);
                    user.save(function (err, result) {
                        if (err) {
                            reject(['Cant save the data in the user', err._message]);
                        }
                    });
                    resolve({
                        data: result
                    });
                }
            });
        }).catch(err => {
            reject([err._message]);
        });
    });
}

// exports.getUserList = function (obj) {
//     var userId = obj.decodedToken.id;
//     var email = obj.decodedToken.email;
//     return new Promise(function (resolve, reject) {
//         userModel.findOne({
//             email: email,
//             _id: ObjectId(userId)
//         }).then((user) => {
//             resolve(user.data.populate('title'));
//         }).catch(err => {
//             reject(['Can\'t find the user', err._message]);
//         })
//     });
// }


exports.getDataList = function (obj) {
    var pageNo = obj.pageNo;
    var perPage = obj.perPage;
    var userId = obj.id;

    pageNo -= 1;
    return new Promise(function (resolve, reject) {
        dataModel.find({
                user: ObjectId(userId)
            }).select('title')
            .limit(perPage)
            .skip(perPage * pageNo)
            .sort({
                createdAt: -1
            }).then(result => {
                return dataModel.find({
                        user: ObjectId(userId)
                    }).countDocuments()
                    .then((count) => {
                        // reject for pages> page
                        resolve({
                            todos: result,
                            page: pageNo + 1,
                            pages: Math.max(1, Math.ceil(count / perPage))
                        })
                    })
            }).catch(err => {
                reject([err._message]);
            })
        // user.populate('data')
        // reject(['some errors occured']);
    });
}

exports.getTodoById = function (obj) {
    var userId = obj.id;
    var todoId = obj.todoId;
    return new Promise(function (resolve, reject) {
        dataModel.findOne({
                _id: ObjectId(todoId),
                user: ObjectId(userId)
            })
            .then(data => {
                resolve(data);
            }).catch(err => {
                reject([err._message]);
            })
    })

}

exports.updateById = function (obj) {
    var userId = obj.id;
    var todoId = obj.todoId;
    var new_todos = obj.new_todos;
    return new Promise(function (resolve, reject) {
        dataModel.findOne({
                _id: ObjectId(todoId),
                user: ObjectId(userId)
            }).select('todo')
            .then(data => {
                data.todo = new_todos;
                return data.save();
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject([err._message]);
            })
    })

}


exports.deleteById = function (obj) {
    var userId = obj.userId;
    var ListId = obj.listId;
    return new Promise(function (resolve, reject) {
        dataModel.deleteOne({
            _id: ObjectId(ListId),
            user: ObjectId(userId)
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject([err._message]);
        })
    })
}