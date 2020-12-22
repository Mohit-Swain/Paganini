const jwt = require('jsonwebtoken');
const twitterTweet = require('../utils/includes/twitter_tweet');
require('dotenv').config();

const todoModel = require('../models/todos');

exports.getTodo = function (req, res) {
    res.render('todo/main');
}

exports.getList = function (req, res) {
    res.render('todo/list');
}

exports.postAddList = function (req, res) {
    console.log('controller');
    var title = req.body.title;
    var work = req.body.work;
    var email = req.email;
    var id = req.userId;
    var obj = {
        title: title,
        work: work,
        email: email,
        id: id
    };
    todoModel.addNewData(obj)
        .then((result) => {
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
}



exports.postList = function (req, res) {
    console.log('controller');
    var pageNo = req.body.pageNo;
    var perPage = req.body.perPage;
    if (!pageNo || !perPage) {
        res.json({
            completed: false,
            errors: ['Some values are missing']
        });
        return;
    }
    var id = req.userId;
    obj = {
        pageNo: pageNo,
        perPage: perPage,
        id: id
    }

    todoModel.getDataList(obj)
        .then((result) => {
            // console.log(result);
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
}


exports.postGetTodoById = function (req, res) {
    var id = req.userId;
    var todoId = req.body.todoId;
    var obj = {
        id: id,
        todoId: todoId
    };

    console.log({
        id: id,
        todoId: todoId
    });

    todoModel.getTodoById(obj)
        .then((result) => {
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
}


exports.putUpdateTodo = function (req, res) {
    var id = req.userId;
    var todoId = req.body.todoId;
    var new_todos = req.body.new_todos;

    var obj = {
        id: id,
        todoId: todoId,
        new_todos: new_todos
    }
    console.log(obj);

    todoModel.updateById(obj)
        .then((result) => {
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
}

exports.deleteListById = function (req, res) {
    var listId = req.body.todoId;
    var id = req.userId;
    var obj = {
        listId: listId,
        userId: id
    }

    todoModel.deleteById(obj)
        .then((result) => {
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
}

exports.sendTweets = function(req,res){
    var dataId = req.body.dataId;
    if(!dataId){
        return res.json({
            completed: false,
            errors: ['Data Id not found']
        });
    }
    else{
        console.log(req.session);
        console.log(req.session.hasTwitter);
        if(!req.session.hasTwitter){
            return res.json({
                completed: false,
                errors: ['please connect twitter account']
            })
        }
        var accessToken =  req.session.twitter.accessToken;
        var refreshToken = req.session.twitter.refreshToken;
        var userName = req.session.twitter.userName;
        if(!accessToken || !refreshToken){
            return res.json({
                completed: false,
                errors: ['AcessToken not found, please reconnect twitter']
            })
        }
        twitterTweet.sendTweet(dataId,accessToken,refreshToken,userName).then((result) => {
            return res.json({
                completed : true,
                result : result
            })
        }).catch((err) => {
            return res.json({
                completed: false,
                errors: err
            })
        });
    }
}