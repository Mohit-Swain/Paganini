const nodemailer = require("nodemailer");
require('dotenv').config();

function sendMail(infoObj) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER, // generated ethereal user
      pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  // {
  //   from: 'Mohit <118cs0219@nitrkl.ac.in>', // sender address
  //   to: "swain6564@gmail.com", // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: "<b>Hello world?</b>", // html body
  // }
  transporter.sendMail(infoObj, function (err, info) {
    console.log(process.env.NODEMAILER_USER);
    console.log(process.env.NODEMAILER_PASSWORD);
    if (err) {
      console.error(err);
    }
    console.log(info);
  });

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = sendMail;
