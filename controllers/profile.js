const jwt = require('jsonwebtoken');
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
    // middleware
    try {
        var decodedToken = jwt.verify(req.session.token, process.env.SECRET_KEY);
    } catch {
        res.redirect('/logout');
        return res.json({
            completed: false,
            errors: ['JWT expired']
        })
    }
    if (!decodedToken) {
        return res.json({
            completed: false,
            errors: ['JWT invalid']
        })
    } else {
        var obj = {
            title: title,
            work: work,
            decodedToken: decodedToken
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
}