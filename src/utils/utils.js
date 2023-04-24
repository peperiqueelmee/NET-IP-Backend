import jwt from 'jsonwebtoken';

const errorResponse = (res, code, message) => res.status(code).json({ code, message });

const generateJWT = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

const generateId = () => {
	return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

function hideEmail(email) {
	const atIndex = email.indexOf('@');
	const username = email.slice(0, atIndex);
	const hiddenUsername =
		username.slice(0, 2) +
		Array(username.length - 2)
			.fill('*')
			.join('');
	const domain = email.slice(atIndex + 1);
	const dotIndex = domain.indexOf('.');
	const hiddenDomain =
		domain.slice(0, 2) +
		Array(dotIndex - 2)
			.fill('*')
			.join('') +
		domain.slice(dotIndex);
	return hiddenUsername + '@' + hiddenDomain;
}

function getFirstName(fullName) {
	const namesArray = fullName.split(' ');
	return namesArray[0];
}

export { errorResponse, generateJWT, generateId, hideEmail, getFirstName };
