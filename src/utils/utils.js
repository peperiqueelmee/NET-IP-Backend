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

const capitalizeString = (str) => {
	const words = str.split(' ');
	const capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return capitalizedWords.join(' ');
};

const validateRut = (rut) => {
	if (rut.indexOf('-') === -1) return false;
	rut = rut.replace(/\./g, '').replace(/\-/g, '');
	var dv = rut.slice(-1).toUpperCase();
	var rutSinDV = rut.slice(0, -1);
	if (!/^\d+$/.test(rutSinDV)) return false;
	var suma = 0,
		factor = 2;
	for (var i = rutSinDV.length - 1; i >= 0; i--) {
		suma += factor * rutSinDV.charAt(i);
		factor = factor === 7 ? 2 : factor + 1;
	}
	var dvEsperado = 11 - (suma % 11);
	if (dvEsperado === 11) dvEsperado = '0';
	else if (dvEsperado === 10) dvEsperado = 'K';
	else dvEsperado = dvEsperado.toString();
	return dv === dvEsperado;
};

export { errorResponse, generateJWT, generateId, hideEmail, getFirstName, capitalizeString, validateRut };
