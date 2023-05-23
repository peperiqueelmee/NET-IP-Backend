import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Department = sequelize.define(
  'department',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'HHRR',
    },
  },
  {
    timestamps: false,
    tableName: 'departments',
  }
);

export default Department;
