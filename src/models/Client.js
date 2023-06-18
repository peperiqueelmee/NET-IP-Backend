import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Client = sequelize.define(
  'client',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rut: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
    },
    names: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    lastnames: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'clients',
    timestamps: false,
  }
);

export default Client;
