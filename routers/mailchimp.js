const express = require('express')
const sgMail = require('@sendgrid/mail');
const mailRouter = express.Router();
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

mailRouter.post('/api/send_message', function (req, res) {
    var name = req.body.name || "Guest";
    var email = req.body.email;
    var message = req.body.message;
    console.log(name);
    console.log(email);
    console.log(message);
    if (!email || !message) {
        return res.json({
            completed: false,
            errors: ['Some values are missing']
        });
    }
    const msg = {
        to: 'swain6564@gmail.com',
        from: 'TrelloHQ <mohit6564@gmail.com>',
        subject: 'You Got a new message from your trello app',
        text: JSON.stringify({
            name: name,
            email: email,
            message: message
        }, null, 2),
        html: `From <strong>${name}</strong> <i>${email}</i><br>
                Message: <blockquote>${message}</blockquote>`,
    };
    sgMail.send(msg);
    return res.redirect('/');
});



module.exports = mailRouter;