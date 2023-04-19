import Employee from '../models/Employee.js';
import { errorResponse, generateJWT } from '../utils/utils.js';

const registerEmployee = async (req, res) => {
	const { email, username, full_name, emp_password } = req.body;

	// Validate empty fields
	const informationIsMissing = !email || !username || !full_name || !emp_password;
	if (informationIsMissing) {
		return errorResponse(res, 400, 'Enter all the information.');
	}

	try {
		// Validate email and username
		const emailAlreadyRegistered = await Employee.findOne({ where: { email } });
		if (emailAlreadyRegistered) {
			return errorResponse(res, 400, 'Email already registered.');
		}

		const usernameAlreadyRegistered = await Employee.findOne({ where: { username } });
		if (usernameAlreadyRegistered) {
			return errorResponse(res, 400, 'Username already registered.');
		}

		// Create employee
		const employee = await Employee.build({
			full_name: full_name.toLowerCase(),
			username: username.toLowerCase(),
			emp_password,
			email: email.toLowerCase(),
		});
		await employee.save();
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
		const getEmployee = await Employee.findOne({ where: { username } });
		if (!getEmployee) {
			return errorResponse(res, 400, 'Unregistered user.');
		}

		const passwordIsValid = await getEmployee.checkPassword(emp_password);
		if (!passwordIsValid) {
			return errorResponse(res, 400, 'Invalid password.');
		}

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

export { registerEmployee, authenticateEmployee };
