import nodemailer from 'nodemailer';

const emailRecoverEmployeePassword = async (data) => {
	const { email, name, token } = data;

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	// Mail body
	await transport.sendMail({
		from: 'Administración Net IP',
		to: email,
		subject: 'Restablece tu contraseña',
		text: 'Restablece tu contraseña',
		html: `<p>Hola ${name},</p>
               <p>Has solicitado restablecer tu contraseña. Sigue el siguiente enlace para generar una nueva:
               <a href="${process.env.FRONTEND_URL}/cambiar-contrasena/${token}">Restablecer contraseña</a></p>
               <p>Si no lo haz solicitado, puedes ignorar este mensaje.</p>`,
	});
};

export default emailRecoverEmployeePassword;
