import { hideEmail, getFirstName, capitalizeString, errorResponse } from '../utils/utils.js';
import emailRecoverEmployeePassword from '../utils/sendEmails.js';
import Employee from '../models/Employee.js';

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
		return res.status(500).json({ message: 'Internal server error.' });
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
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const getEmployees = async (req, res) => {
	const { rut } = req.params;

	try {
		const employeeData = rut ? await Employee.findAll({ where: { rut } }) : await Employee.findAll();
		return employeeData.length
			? res.status(200).json({ code: 200, data: employeeData })
			: res.status(404).json({ code: 404, message: 'No employees found.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const getEmployeesByStatus = async (req, res) => {
	const { status } = req.params;

	try {
		const employeeData = await Employee.findAll({
			where: { status_id: status },
		});

		return employeeData.length
			? res.status(200).json({ code: 200, data: employeeData })
			: res.status(404).json({ code: 404, message: 'No employees found.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export {
	registerEmployee,
	authenticateEmployee,
	sendEmailToRecoverPassword,
	getNameEmployee,
	newEmployeePassword,
	getEmployees,
	getEmployeesByStatus,
};
