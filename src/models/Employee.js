import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import Role from './Role.js';
import Status from './Status.js';

const Employee = sequelize.define(
	'employee',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		rut: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		names: {
			type: Sequelize.STRING(60),
			allowNull: false,
		},
		lastnames: {
			type: Sequelize.STRING(60),
			allowNull: false,
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		role_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING(60),
			allowNull: false,
		},
		username: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		emp_password: {
			type: Sequelize.STRING(150),
			allowNull: false,
		},
		token: {
			type: Sequelize.STRING(60),
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
Employee.belongsTo(Status, { foreignKey: 'status_id' });
Employee.belongsTo(Role, { foreignKey: 'role_id' });
Employee.prototype.checkPassword = async function (passwordForm) {
	return await bcrypt.compare(passwordForm, this.emp_password);
};

export default Employee;
