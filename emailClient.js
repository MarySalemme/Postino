const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.sparkpostmail.com',
        port: 587,
        auth: {
            user: 'SMTP_Injection',
            pass: 'blabla'
        }
    });

    let mailOptions = {
        from: '"Mary the postino" <hello@marysalemme.com>',
        to: 'jamesransome@msn.com',
        subject: 'Hello from Postino',
        text: 'Bitch you got mail',
        html: '<b>Postino</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });
});
