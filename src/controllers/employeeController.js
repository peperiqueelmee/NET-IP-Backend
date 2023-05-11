import { hideEmail, getFirstName, capitalizeString } from '../utils/utils.js';
import emailRecoverEmployeePassword from '../utils/sendEmails.js';
import Employee from '../models/Employee.js';
import Role from '../models/Role.js';
import Status from '../models/Status.js';

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
	const { page = 1, limit = 20 } = req.query;

	const offset = (page - 1) * limit;

	try {
		const employeeData = await Employee.findAndCountAll({
			where: rut ? { rut } : {},
			include: [
				{
					model: Role,
					attributes: ['description'],
				},
				{
					model: Status,
					attributes: ['description'],
				},
			],
			attributes: { exclude: ['emp_password', 'token'] },
			offset: parseInt(offset),
			limit: parseInt(limit),
		});

		return employeeData.rows.length
			? res.status(200).json({ code: 200, data: employeeData.rows, total: employeeData.count })
			: res.status(404).json({ code: 404, data: {} });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const getEmployeesByStatus = async (req, res) => {
	const { status } = req.params;
	const { page = 1, limit = 20 } = req.query;

	const offset = (page - 1) * limit;

	try {
		const employeeData = await Employee.findAndCountAll({
			where: { status_id: status },
			include: [
				{
					model: Status,
					attributes: ['description'],
				},
				{
					model: Role,
					attributes: ['description'],
				},
			],
			offset: parseInt(offset),
			limit: parseInt(limit),
		});

		return employeeData.rows.length
			? res.status(200).json({ code: 200, data: employeeData.rows, total: employeeData.count })
			: res.status(404).json({ code: 404, data: {} });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

const updateEmployee = async (req, res) => {
	const { rut, names, lastnames, status_id, role_id, email, username, emp_password } = req.body;
	const { employee } = req.employee;

	try {
		// Update employee fields
		employee.rut = rut || employee.rut;
		employee.names = names || employee.names;
		employee.lastnames = lastnames || employee.lastnames;
		employee.status_id = status_id || employee.status_id;
		employee.role_id = role_id || employee.role_id;
		employee.email = email || employee.email;
		employee.username = username || employee.username;
		employee.emp_password = emp_password || employee.emp_password;

		await employee.save();
		return res.status(200).json({ code: 200, data: employee });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export {
	authenticateEmployee,
	getEmployees,
	getEmployeesByStatus,
	getNameEmployee,
	newEmployeePassword,
	registerEmployee,
	sendEmailToRecoverPassword,
	updateEmployee,
};
