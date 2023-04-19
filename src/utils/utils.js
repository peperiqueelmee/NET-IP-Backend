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

export { errorResponse, generateJWT, generateId };
