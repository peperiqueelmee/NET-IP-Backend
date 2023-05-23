import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const AnexType = sequelize.define(
  'anex_type',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'Anexo',
    },
  },
  {
    timestamps: false,
    tableName: 'anex_types',
  }
);

export default AnexType;
