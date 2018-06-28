const sgMail = require('@sendgrid/mail')

const key = "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"

sgMail.setApiKey(key);
const msg = {
  to: 'jansherkhan@gmail.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);