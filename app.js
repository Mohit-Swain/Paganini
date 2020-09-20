const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const user = require('./utils/schema/user');
require('dotenv').config()




const homeRouter = require(path.join(__dirname, '/routers', 'home'));
const authRouter = require(path.join(__dirname, '/routers', 'auth'));
const profileRouter = require(path.join(__dirname, '/routers', 'profile'));
const oauthRouter = require(path.join(__dirname, '/routers', 'oauth'));
const mailChimpRouter = require(path.join(__dirname, '/routers', 'mailchimp'));
const google_outh = require(path.join(__dirname, '/utils', 'middlewares', 'google-oauth'));


passport.use(google_outh.config());

const app = express();


app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(morgan('tiny'));

var url = `mongodb+srv://mohit6564:${process.env.mongoPassword}@cluster0.r69uy.mongodb.net/appDB?retryWrites=true&w=majority`;

app.use(session({
    secret: 'keyboard dog',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Oauth
const User = require(path.join(__dirname, '/utils', 'schema', 'user'))
passport.serializeUser(function (user, cb) {
    console.log('sear');
    cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
    console.log('desear');
    User.findById(mongoose.Types.ObjectId(id))
        .then(user => cb(null, user))
        .catch(err => cb(err));
});


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.session.isLoggedIn = false;
    }
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.userName = req.session.name || "";
    next();
})

app.use('/api', authRouter);
app.use(oauthRouter);
app.use(homeRouter);
app.use(profileRouter);
app.use(mailChimpRouter);

app.use((err, req, res, next) => {
    console.log('*********************************');
    console.log('error is \n', err);
    if (err.statusCode === 500) {
        req.session.isLoggedIn = false;
    }
    res.send(err);
    next();
})
const port = process.env.PORT || 3000;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    let listener = app.listen(port, () => {
        // console.log(req.session);
        console.log(`Example app listening on port ${listener.address().port}!`);
    });
});