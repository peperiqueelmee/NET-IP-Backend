import { errorResponse, validateRut, generateJWT, generateId, getFirstName } from '../utils/utils.js';
import { validateFullFields, ValidatePasswordStrength } from '../utils/Validations.js';
import Employee from '../models/Employee.js';

const validateEmployeeRegistration = async (req, res, next) => {
	const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;

	//Validations fields and format
	if (!validateFullFields([rut, names, lastnames, role_id, email, username, emp_password])) {
		return errorResponse(res, 400, 'Por favor completa el formulario.');
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

		if (!ValidatePasswordStrength(emp_password)) {
			return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.');
		}
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const validateEmployeeAuthentication = async (req, res, next) => {
	const { username, emp_password } = req.body;

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
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const validateDataEmployeeRecoverPassword = async (req, res, next) => {
	const { username } = req.body;

	if (!validateFullFields([username])) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate username.
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 404, 'Unregistered user.');
		}
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
		return res.status(500).json({ message: 'Internal server error.' });
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
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const validateDataNewPassword = async (req, res, next) => {
	const { token } = req.params;
	const { emp_password } = req.body;

	if (!validateFullFields([emp_password])) {
		return errorResponse(res, 400, 'Por favor completa todos los campos.');
	}

	try {
		const tokenIsValid = await Employee.findOne({ where: { token } });
		if (!tokenIsValid) {
			return errorResponse(res, 401, 'Invalid Token.');
		}
		// Attach the employee object.
		req.employee = {
			employee: tokenIsValid,
			emp_password,
		};
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export {
	validateEmployeeRegistration,
	validateEmployeeAuthentication,
	validateDataEmployeeRecoverPassword,
	validateToken,
	validateDataNewPassword,
};
