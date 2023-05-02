import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import Client from './Client.js';
import Status from './Status.js';

const ClientPhone = sequelize.define(
	'clients_phones',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		phone_number: {
			type: Sequelize.STRING(12),
			allowNull: false,
			unique: true,
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		client_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: 'clients_phones',
		timestamps: false,
	}
);

ClientPhone.belongsTo(Status, { foreignKey: 'status_id' });
ClientPhone.belongsTo(Client, { foreignKey: 'client_id' });

export default ClientPhone;
