import Employee from '../models/Employee.js';
import { ValidatePasswordStrength, validateFullFields, alreadyRegistered } from '../utils/Validations.js';
import { errorResponse, generateId, generateJWT, getFirstName, validateRut } from '../utils/utils.js';

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
		const isRutAlreadyRegistered = await alreadyRegistered(Employee, 'rut', rut);
		if (isRutAlreadyRegistered) {
			return errorResponse(res, 409, 'RUT ya registrado.');
		}
		const isEmailAlreadyRegistered = await alreadyRegistered(Employee, 'email', email);
		if (isEmailAlreadyRegistered) {
			return errorResponse(res, 409, 'Email ya registrado.');
		}
		const usernameAlreadyRegistered = await alreadyRegistered(Employee, 'username', username);
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

const validateEmployeeUpdate = async (req, res, next) => {
	const { id } = req.params;
	const { rut, email, username, emp_password } = req.body;

	try {
		const employee = await Employee.findOne({ where: { id } });
		if (!employee) {
			return res.status(404).json({ code: 404, message: 'Employee not found.' });
		}
		// Validate duplicate data.
		if (rut) {
			if (!validateRut(rut)) {
				return errorResponse(res, 409, 'RUT y/o formato incorrecto.');
			}
			const isRutAlreadyRegistered = await alreadyRegistered(Employee, 'rut', rut, id);
			if (isRutAlreadyRegistered) {
				return errorResponse(res, 409, 'RUT ya registrado.');
			}
		}
		if (email) {
			const isEmailAlreadyRegistered = await alreadyRegistered(Employee, 'email', email, id);
			if (isEmailAlreadyRegistered) {
				return errorResponse(res, 409, 'Email ya registrado.');
			}
		}
		if (username) {
			const usernameAlreadyRegistered = await alreadyRegistered(Employee, 'username', username, id);
			if (usernameAlreadyRegistered) {
				return errorResponse(res, 409, 'Username ya registrado.');
			}
		}

		if (emp_password && !ValidatePasswordStrength(emp_password)) {
			return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.');
		}
		// Attach the employee object.
		req.employee = {
			employee,
		};
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export {
	validateDataEmployeeRecoverPassword,
	validateDataNewPassword,
	validateEmployeeAuthentication,
	validateEmployeeUpdate,
	validateEmployeeRegistration,
	validateToken,
};
