const express = require('express');
const userModel = require('../utils/schema/user');
const mailRouter = express.Router();
const sendMail = require('../utils/includes/sendmail');
const crypto = require('crypto');
require('dotenv').config();
const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

mailRouter.post('/api/send_message', function (req, res) {
    var name = req.body.name || "Guest";
    var email = req.body.email;
    var message = req.body.message;
    if (!email || !message) {
        return res.json({
            completed: false,
            errors: ['Some values are missing']
        });
    }
    const msg = {
        to: 'swain6564@gmail.com',
        from: 'TwelloHQ <mohit6564@gmail.com>',
        subject: 'You Got a new message from your twello app',
        text: JSON.stringify({
            name: name,
            email: email,
            message: message
        }, null, 2),
        html: `From <strong>${name}</strong> <i>${email}</i><br>
                Message: <blockquote>${message}</blockquote>`,
    };
    mailjet.post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": "mohit6564@gmail.com",
                    "Name": "TwelloHQ"
                },
                "To": [{
                    "Email": msg.to,
                    "Name": "passenger 1"
                }],
                "Subject": msg.subject,
                "TextPart": msg.text,
                "HTMLPart": msg.html
            }]

        }).then((result) => {
            console.log(result.body);
        })
        .catch((err) => {
            console.log(err);
        });

    return res.redirect('/');
});

mailRouter.post('/api/send_recovery_mail', function (req, res) {
    var url = '';
    if (process.env.NODE_ENV === 'development') {
        url = "http://localhost:3000";
    }
    else if (process.env.NODE_ENV === 'production') {
        url = process.env.PROD_URL;
    }
    var email = req.body.email;
    if (!email) {
        return res.json({
            completed: false,
            errors: ['Email is missing']
        });
    }
    userModel.findOne({
        email: email,
        googleId: {
            $exists: false
        }
    }).then(user => {
        if (!user) {
            return res.json({
                completed: false,
                errors: ['No such user found, Please SignIn']
            });
        }
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                return res.json({
                    completed: false,
                    errors: ['Token Generation Failed']
                });
            }
            const token = buffer.toString('hex');
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 20 * 60 * 1000;
            user.save();
            res.json({
                completed: true
            });
            const msg = {
                to: email,
                from: 'TwelloHQ <mohit6564@gmail.com>',
                subject: 'Password Reset Email for your twello account!',
                text: `GoTo : ${url}/reset_password/${token}`,
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
                
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
                <!--[if !mso]><!-->
                <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                <!--<![endif]-->
                <!--[if (gte mso 9)|(IE)]>
                <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                      <![endif]-->
                  <!--[if (gte mso 9)|(IE)]>
                  <style type="text/css">
                  body {width: 600px;margin: 0 auto;}
                  table {border-collapse: collapse;}
                  table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
                  img {-ms-interpolation-mode: bicubic;}
                  </style>
                  <![endif]-->
                  <style type="text/css">
                  body,
                  p,
                  div {
                      font-family: arial, helvetica, sans-serif;
                      font-size: 14px;
                    }
                    
                    body {
                        color: #000000;
                    }
                    
                    body a {
                        color: #1188E6;
                        text-decoration: none;
                    }
                    
                    p {
                        margin: 0;
                        padding: 0;
                    }
                    
                    table.wrapper {
                        width: 100% !important;
                        table-layout: fixed;
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    
                    img.max-width {
                        max-width: 100% !important;
                    }
                    
                    .column.of-2 {
                        width: 50%;
                    }
                    
                    .column.of-3 {
                        width: 33.333%;
                    }
                
                    .column.of-4 {
                        width: 25%;
                    }
                    
                    @media screen and (max-width:480px) {
                        
                        .preheader .rightColumnContent,
                        .footer .rightColumnContent {
                            text-align: left !important;
                        }
                        
                        .preheader .rightColumnContent div,
                        .preheader .rightColumnContent span,
                        .footer .rightColumnContent div,
                        .footer .rightColumnContent span {
                            text-align: left !important;
                        }
                        
                        .preheader .rightColumnContent,
                        .preheader .leftColumnContent {
                            font-size: 80% !important;
                            padding: 5px 0;
                        }
                        
                        table.wrapper-mobile {
                            width: 100% !important;
                            table-layout: fixed;
                        }
                        
                        img.max-width {
                            height: auto !important;
                            max-width: 100% !important;
                        }
                        
                        a.bulletproof-button {
                            display: block !important;
                            width: auto !important;
                            font-size: 80%;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }
                        
                        .columns {
                            width: 100% !important;
                        }
                        
                        .column {
                            display: block !important;
                            width: 100% !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                        }
                        
                        .social-icon-column {
                            display: inline-block !important;
                        }
                    }
                    </style>
                    <!--user entered Head Start-->
                    <!--End Head user entered-->
                    </head>
                    
                    <body>
                    <center class="wrapper" data-link-color="#1188E6"
                    data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
                    <div class="webkit">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                        <tr>
                          <td valign="top" bgcolor="#FFFFFF" width="100%">
                          <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0"
                              border="0">
                              <tr>
                              <td width="100%">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                              <td>
                              <!--[if mso]>
                              <center>
                              <table><tr><td width="600">
                              <![endif]-->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                              style="width:100%; max-width:600px;" align="center">
                              <tr>
                              <td role="modules-container"
                              style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF"
                              width="100%" align="left">
                              <table class="module preheader preheader-hide" role="module" data-type="preheader"
                              border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                              <tr>
                              <td role="module-content">
                              <p>Please check it</p>
                              </td>
                              </tr>
                              </table>
                              <table class="module" role="module" data-type="code" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="7e61fc93-12c4-4eb1-8b11-a755942f86bd">
                              <tbody>
                              <tr>
                              <td height="100%" valign="top" role="module-content">
                              <h2>Reset Twello Password</h2>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="ecf14fde-262a-46ea-99f8-6cea2c4b5573" data-mc-module-version="2019-10-22">
                              <tbody>
                              <tr>
                              <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"
                              height="100%" valign="top" bgcolor="" role="module-content">
                              <div>
                              <div style="font-family: inherit; text-align: inherit">Hello Sir/Mam,</div>
                              <div style="font-family: inherit; text-align: justify">We are sending you this
                              mail because you requested a password reset. Please click on the link below to
                              create a new password:</div>
                              <div style="font-family: inherit; text-align: inherit"><br></div>
                              <div></div>
                              </div>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button"
                              data-type="button" role="module" style="table-layout:fixed;" width="100%"
                              data-muid="f0820921-3820-4fce-afe9-7160318a9bec">
                              <tbody>
                              <tr>
                              <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
                              <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile"
                              style="text-align:center;">
                              <tbody>
                              <tr>
                              <td align="center" bgcolor="#19c0d5" class="inner-td"
                              style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                              <a href="${url}/reset_password/${token}"
                              style="background-color:#19c0d5; border:0px solid #333333; border-color:#333333; border-radius:3px; border-width:0px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;"
                              target="_blank">Set a new Password</a>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="775d1def-28c5-4e6f-b730-14fae63dbb0a" data-mc-module-version="2019-10-22">
                              <tbody>
                              <tr>
                              <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"
                              height="100%" valign="top" bgcolor="" role="module-content">
                              <div>
                              <div style="font-family: inherit; text-align: center">If you didn't request the
                              password reset you can ignore this email the password will not be changed.
                              </div>
                              <div></div>
                              </div>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="25afa693-5104-4965-841e-bce52bc0cb40" data-mc-module-version="2019-10-22">
                              <tbody>
                              <tr>
                              <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"
                              height="100%" valign="top" bgcolor="" role="module-content">
                              <div>
                              <div style="font-family: inherit; text-align: center"><strong>-The Twello
                              Team</strong></div>
                              <div></div>
                              </div>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table class="module" role="module" data-type="divider" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="51d1a0bf-f49c-4f3e-8b2c-75754fa726a2">
                              <tbody>
                              <tr>
                              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%"
                              valign="top" bgcolor="">
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                              height="5px" style="line-height:5px; font-size:5px;">
                              <tbody>
                              <tr>
                              <td style="padding:0px 0px 5px 0px;" bgcolor="#000000"></td>
                              </tr>
                              </tbody>
                              </table>
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0"
                              cellspacing="0" width="100%" style="table-layout: fixed;"
                              data-muid="a9efb8d5-51f0-4253-96d3-1d076618a17a">
                              <tbody>
                              <tr>
                              <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top"
                              align="center">
                              <img class="max-width" border="0"
                              style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:20% !important; width:20%; height:auto !important;"
                              width="120" alt="" data-proportionally-constrained="true" data-responsive="true"
                              src="http://cdn.mcauto-images-production.sendgrid.net/bcfcc056d005c86a/25dbfce5-d4a2-4818-b894-fdf1ab2563cc/150x150.png">
                              </td>
                              </tr>
                              </tbody>
                              </table>
                              </td>
                              </tr>
                              </table>
                              <!--[if mso]>
                              </td>
                              </tr>
                              </table>
                              </center>
                              <![endif]-->
                              </td>
                              </tr>
                              </table>
                              </td>
                              </tr>
                              </table>
                              </td>
                              </tr>
                              </table>
                              </div>
                              </center>
                              </body>
                              
                              </html>`,
            };
            mailjet.post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [{
                        "From": {
                            "Email": "mohit6564@gmail.com",
                            "Name": "TwelloHQ"
                        },
                        "To": [{
                            "Email": msg.to,
                            "Name": "passenger 1"
                        }],
                        "Subject": msg.subject,
                        "TextPart": msg.text,
                        "HTMLPart": msg.html
                    }]
                });
        });
    }).catch(err => {
        return res.json({
            completed: false,
            errors: [err]
        });
    });
});

module.exports = mailRouter;