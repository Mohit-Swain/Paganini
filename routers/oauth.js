const express = require('express');
const passport = require('passport');
const oauthRoutes = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

oauthRoutes.get('/oauth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

oauthRoutes.get('/oauth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log(req.user);
        req.session.isLoggedIn = true;
        req.session.name = req.user.userName;
        req.session.save()

        res.redirect('/');
    });




module.exports = oauthRoutes;