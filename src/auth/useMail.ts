import * as nodemailer from 'nodemailer'

const sendMail = async (
	userId: string,
	activationKey: string,
	email: string
) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT) || 0,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
		}
	})

	const mailOptions = {
		from: 'registrator0156@gmail.com',
		to: email,
		subject: 'Online-Cinema Email confirmation',
		text: '',
		html: `
            <h2>Someone created an Online-Cinema account with this E-mail. If it was you, click on the link to confirm your email:</h2>
            <br/>
            <a href="http://localhost:3100/auth/confirmation-email/${userId}/${activationKey}">Email confirmation link</a>
        `
	}

	await transporter.sendMail(mailOptions)
}

export default sendMail
