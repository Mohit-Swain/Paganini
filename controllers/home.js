module.exports = {
    getHome: function (req, res) {
        res.render('home/home');
    },
    getLogin: function (req, res) {
        res.render('home/login');
    },
    getSignup: function (req, res) {
        res.render('home/signup');
    }
}