import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Status = sequelize.define(
	'status',
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
			defaultValue: 'Sin Estado Asignado',
		},
	},
	{
		tableName: 'statuses',
		timestamps: false,
	}
);

export default Status;
