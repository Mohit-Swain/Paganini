const express = require('express')
const homeController = require('../controllers/home');
const homeRouter = express.Router();

homeRouter.get('/login', homeController.getLogin);

homeRouter.get('/signup', homeController.getSignup);

homeRouter.get('/', homeController.getHome);
module.exports = homeRouter;