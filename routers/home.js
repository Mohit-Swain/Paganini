const express = require('express')
const homeController = require('../controllers/home');
const homeRouter = express.Router();

homeRouter.get('/login', homeController.getLogin);

homeRouter.get('/signup', homeController.getSignup);

homeRouter.get('/reset_password/:token', homeController.getResetPassword);

homeRouter.get('/forgot_password', homeController.getForgotPassword);
homeRouter.get('/', homeController.getHome);
module.exports = homeRouter;