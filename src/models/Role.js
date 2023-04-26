import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Role = sequelize.define(
	'role',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		description: {
			type: Sequelize.STRING(30),
			allowNull: false,
			defaultValue: 'Sin Rol Asignado',
		},
	},
	{
		tableName: 'roles',
		timestamps: false,
	}
);

export default Role;
