const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

const emailer = email => {
	nodemailer.createTestAccount((err, account) => {
		const transporter = nodemailer.createTransport({
			host: 'smtp.sparkpostmail.com',
			port: 587,
			auth: {
				user: 'SMTP_Injection',
				pass: process.env.SPARK_API_KEY
			}
		})

		let mailOptions = {
			from: '"Mary the postino" <hello@marysalemme.com>',
			to: email,
			subject: 'Hello from Postino',
			// text: 'M8, you got mail',
			html: '<b>Postino</b></br><p>M8, you got mail</p>'
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);

		})
	})
}

module.exports = emailer