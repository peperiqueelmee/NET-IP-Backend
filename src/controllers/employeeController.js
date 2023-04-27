import Employee from '../models/Employee.js';
import {
	errorResponse,
	generateId,
	generateJWT,
	hideEmail,
	getFirstName,
	capitalizeString,
	validateRut,
} from '../utils/utils.js';
import emailRecoverEmployeePassword from '../utils/sendEmails.js';

const registerEmployee = async (req, res) => {
	const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;
	// Validate empty fields
	const informationIsMissing = !rut || !names || !lastnames || !role_id || !email || !username || !emp_password;
	if (informationIsMissing) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate duplicate data
		const rutIsValid = validateRut(rut);
		if (!rutIsValid) {
			return errorResponse(res, 409, 'RUT y/o formato incorrecto.');
		}
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
		// Save to database
		const employee = await Employee.build({
			rut,
			names: capitalizeString(names),
			lastnames: capitalizeString(lastnames),
			role_id,
			username: username.toLowerCase(),
			emp_password,
			email: email.toLowerCase(),
		});
		await employee.save();
		// Response
		res.status(200).json({ code: 200, data: employee });
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

const authenticateEmployee = async (req, res) => {
	const { username, emp_password } = req.body;
	// Validate empty fields
	const informationIsMissing = !username || !emp_password;
	if (informationIsMissing) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate username and password
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 404, 'Unregistered user.');
		}
		const passwordIsValid = await getEmployee.checkPassword(emp_password);
		if (!passwordIsValid) {
			return errorResponse(res, 401, 'Invalid password.');
		}
		// Response
		const employee = {
			username,
			email: getEmployee.email,
			token: generateJWT(getEmployee.employee_id),
		};
		res.json({ code: 200, data: employee });
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

const sendEmailToRecoverPassword = async (req, res) => {
	const { username } = req.body;
	// Validate empty fields
	const informationIsMissing = !username;
	if (informationIsMissing) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate username
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 404, 'Unregistered user.');
		}
		// Generate token
		getEmployee.token = generateId();
		await getEmployee.save();

		// Data employee
		const name = getFirstName(getEmployee.names);
		const email = getEmployee.email;
		const token = getEmployee.token;

		//Send email with instructions
		emailRecoverEmployeePassword({
			email,
			name,
			token,
		});

		// Response
		const employee = {
			name,
			email: hideEmail(email),
			token,
		};
		res.status(200).json({ code: 200, data: employee });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const checkToken = async (req, res) => {
	const { token } = req.params;

	try {
		// Validate token
		const tokenIsValid = await Employee.findOne({ where: { token } });
		if (!tokenIsValid) {
			return errorResponse(res, 401, 'Invalid Token.');
		}
		// Response
		const employee = {
			name: getFirstName(tokenIsValid.full_name),
		};
		res.status(200).json({ code: 200, data: employee });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const newEmployeePassword = async (req, res) => {
	const { token } = req.params;
	const { emp_password } = req.body;
	// Validate empty fields
	const informationIsMissing = !emp_password;
	if (informationIsMissing) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate username
		const tokenIsValid = await Employee.findOne({ where: { token } });
		if (!tokenIsValid) {
			return errorResponse(res, 401, 'Invalid Token.');
		}
		// Modify password
		const getEmployee = tokenIsValid;
		getEmployee.token = null;
		getEmployee.emp_password = emp_password;
		await getEmployee.save();
		// Response
		const employee = {
			name: getFirstName(getEmployee.full_name),
		};
		res.status(200).json({ code: 200, data: employee });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export { registerEmployee, authenticateEmployee, sendEmailToRecoverPassword, checkToken, newEmployeePassword };
