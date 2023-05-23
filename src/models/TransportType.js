import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const TransportType = sequelize.define(
  'transport_type',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'UDP',
    },
  },
  {
    timestamps: false,
    tableName: 'transport_types',
  }
);

export default TransportType;
