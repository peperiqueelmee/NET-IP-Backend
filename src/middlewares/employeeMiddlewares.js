import { errorResponse, validateRut, generateJWT, generateId, getFirstName } from '../utils/utils.js';
import { validateFullFields } from '../utils/Validations.js';
import Employee from '../models/Employee.js';

const validateEmployeeRegistration = async (req, res, next) => {
	const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;

	// Completed field validations and rut format.
	if (!validateFullFields([rut, names, lastnames, role_id, email, username, emp_password])) {
		return errorResponse(res, 400, 'Enter all the information.');
	}
	if (!validateRut(rut)) {
		return errorResponse(res, 409, 'RUT y/o formato incorrecto.');
	}

	try {
		// Validate duplicate data.
		const rutAlreadyRegistered = await Employee.findOne({ where: { rut } });
		if (rutAlreadyRegistered) {
			return errorResponse(res, 409, 'RUT ya registrado.');
		}
		const emailAlreadyRegistered = await Employee.findOne({ where: { email } });
		if (emailAlreadyRegistered) {
			return errorResponse(res, 409, 'Email ya registrado.');
		}
		const usernameAlreadyRegistered = await Employee.findOne({ where: { username } });
		if (usernameAlreadyRegistered) {
			return errorResponse(res, 409, 'Username ya registrado.');
		}
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

const validateEmployeeAuthentication = async (req, res, next) => {
	const { username, emp_password } = req.body;

	// Validate empty fields.
	if (!validateFullFields([username, emp_password])) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 404, 'Unregistered user.');
		}
		const passwordIsValid = await getEmployee.checkPassword(emp_password);
		if (!passwordIsValid) {
			return errorResponse(res, 401, 'Invalid password.');
		}
		// Attach the employee object.
		req.employee = {
			username,
			email: getEmployee.email,
			token: generateJWT(getEmployee.employee_id),
		};
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

const validateDataEmployeeRecoverPassword = async (req, res, next) => {
	const { username } = req.body;

	// Validate empty fields.
	if (!validateFullFields([username])) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate username.
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 404, 'Unregistered user.');
		}
		// Generate token.
		getEmployee.token = generateId();
		await getEmployee.save();
		// Attach the employee object.
		req.employee = {
			name: getFirstName(getEmployee.names),
			email: getEmployee.email,
			token: getEmployee.token,
		};
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const validateToken = async (req, res, next) => {
	const { token } = req.params;

	try {
		const tokenIsValid = await Employee.findOne({ where: { token } });
		if (!tokenIsValid) {
			return errorResponse(res, 401, 'Invalid Token.');
		}
		// Attach the employee object.
		req.employee = {
			name: getFirstName(tokenIsValid.names),
		};
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const validateDataNewPassword = async (req, res, next) => {
	const { token } = req.params;
	const { emp_password } = req.body;

	// Validate empty fields.
	if (!validateFullFields([emp_password])) {
		return errorResponse(res, 400, 'Por favor completa todos los campos.');
	}

	try {
		// Validate username.
		const tokenIsValid = await Employee.findOne({ where: { token } });
		if (!tokenIsValid) {
			return errorResponse(res, 401, 'Invalid Token.');
		}
		req.employee = {
			employee: tokenIsValid,
			emp_password,
		};
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export {
	validateEmployeeRegistration,
	validateEmployeeAuthentication,
	validateDataEmployeeRecoverPassword,
	validateToken,
	validateDataNewPassword,
};
