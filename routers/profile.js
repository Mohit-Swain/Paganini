const express = require('express')
const profileController = require('../controllers/profile')
const profileRouter = express.Router();
const jwtMiddleware = require('../utils/middlewares/jwt_authorize');

profileRouter.get('/todo', profileController.getTodo);

profileRouter.get('/list', profileController.getList);

profileRouter.post('/todo/postAddList', jwtMiddleware.authorize, profileController.postAddList);

profileRouter.post('/list/postList', jwtMiddleware.authorize, profileController.postList);

profileRouter.post('/todo/postGetTodoById', jwtMiddleware.authorize, profileController.postGetTodoById);

profileRouter.post('/todo/postToTwitter',jwtMiddleware.authorize,jwtMiddleware.twitterAuthorize,profileController.sendTweets);

profileRouter.put('/todo/updateTodoById', jwtMiddleware.authorize, profileController.putUpdateTodo);

profileRouter.delete('/list/deleteListById', jwtMiddleware.authorize, profileController.deleteListById);
module.exports = profileRouter;