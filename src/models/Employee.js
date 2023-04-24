import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';

const Employee = sequelize.define(
	'employee',
	{
		employee_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		full_name: {
			type: Sequelize.STRING(200),
			allowNull: false,
		},
		username: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		emp_password: {
			type: Sequelize.STRING(200),
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING(60),
			allowNull: false,
		},
		token: {
			type: Sequelize.STRING(100),
		},
	},
	{
		timestamps: false,
		hooks: {
			beforeCreate: async function (employee, options) {
				if (employee.changed('emp_password')) {
					const salt = await bcrypt.genSalt(10);
					employee.emp_password = await bcrypt.hash(employee.emp_password, salt);
				}
			},
			beforeUpdate: async function (employee, options) {
				if (employee.changed('emp_password')) {
					const salt = await bcrypt.genSalt(10);
					employee.emp_password = await bcrypt.hash(employee.emp_password, salt);
				}
			},
		},
	}
);
Employee.prototype.checkPassword = async function (passwordForm) {
	return await bcrypt.compare(passwordForm, this.emp_password);
};

export default Employee;
