const express = require('express')
const profileController = require('../controllers/profile')
const profileRouter = express.Router();

profileRouter.get('/todo', profileController.getTodo);

profileRouter.get('/list', profileController.getList);

profileRouter.post('/todo/postAddList', profileController.postAddList)
module.exports = profileRouter;