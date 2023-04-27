import Employee from '../models/Employee.js';
import { hideEmail, getFirstName, capitalizeString } from '../utils/utils.js';
import emailRecoverEmployeePassword from '../utils/sendEmails.js';

const registerEmployee = async (req, res) => {
	const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;

	try {
		const employeeData = await Employee.create({
			rut,
			names: capitalizeString(names),
			lastnames: capitalizeString(lastnames),
			role_id,
			username: username.toLowerCase(),
			emp_password,
			email: email.toLowerCase(),
		});
		res.status(200).json({ code: 200, data: employeeData });
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

const authenticateEmployee = async (req, res) => {
	const employeeData = req.employee;
	res.json({ code: 200, data: employeeData });
};

const sendEmailToRecoverPassword = async (req, res) => {
	const { name, email, token } = req.employee;

	//Send email with instructions.
	emailRecoverEmployeePassword({
		email,
		name,
		token,
	});
	// Response.
	const employeeData = {
		name,
		email: hideEmail(email),
		token,
	};
	res.status(200).json({ code: 200, data: employeeData });
};

const getNameEmployee = async (req, res) => {
	const { name } = req.employee;
	res.status(200).json({ code: 200, data: name });
};

const newEmployeePassword = async (req, res) => {
	const { employee, emp_password } = req.employee;

	try {
		// Update password.
		employee.token = null;
		employee.emp_password = emp_password;
		await employee.save();
		// Response.
		const employeeData = {
			name: getFirstName(employee.names),
		};
		res.status(200).json({ code: 200, data: employeeData });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export { registerEmployee, authenticateEmployee, sendEmailToRecoverPassword, getNameEmployee, newEmployeePassword };
