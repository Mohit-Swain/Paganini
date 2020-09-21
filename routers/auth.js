const express = require('express');
const authControllers = require('../controllers/auth');

const authRoutes = express.Router();
authRoutes.post('/login', authControllers.postLogin);

authRoutes.post('/signup', authControllers.postSignUp);

authRoutes.get('/logout', authControllers.getLogOut);

authRoutes.put('/changePassword', authControllers.putChangePassword);
module.exports = authRoutes;