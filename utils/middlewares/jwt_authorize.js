const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authorize = function (req, res, next) {
    if (req.user) {
        // for Oauth
        // console.log(req.user);
        req.userId = req.user._id;
        req.email = req.user.email;
        next();
    } else {
        jwt.verify(req.session.token, process.env.SECRET_KEY, function (err, decoded) {
            // for JWT;
            if (err) {
                console.log('__________________________');

                err.statusCode = 500;
                req.session.isLoggedIn = false;
                return res.json({
                    completed: false,
                    errors: ['Jwt Verification failed'],
                    errorCode: 500
                });
            } else {
                console.log('jwt verified');
                req.userId = decoded.id;
                req.email = decoded.email;
                next();
            }
        });
    }
}

exports.twitterAuthorize = function(req,res,next){
    if(!req.session.hasTwitter){
        return res.json({
            completed : false,
            errors : ['Twitter handle not found!'],
            errorCode: 500
        });
    }
    next();
}