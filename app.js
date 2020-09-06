const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config()




const homeRouter = require(path.join(__dirname, '/routers', 'home'));
const authRouter = require(path.join(__dirname, '/routers', 'auth'));
const userViewMiddleware = require(path.join(__dirname, '/lib', 'middleware', 'userInView'));

const app = express();


app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: false
}));
app.use(bodyParser.json());
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
}))

app.use('/api', authRouter);
app.use(homeRouter);


const port = process.env.PORT || 3000;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    let listener = app.listen(port, () => {
        console.log(`Example app listening on port ${listener.address().port}!`);
    });

});