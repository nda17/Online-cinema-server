import * as nodemailer from 'nodemailer'

const sendMail = async (
	textSubject: string,
	textTitle: string,
	textLink: string,
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
		subject: textSubject,
		text: '',
		html: `
            ${textTitle}
            <br/>
			${textLink}
        `
	}

	await transporter.sendMail(mailOptions)
}

export default sendMail
