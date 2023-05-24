import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';

const Restriction = sequelize.define(
  'restrictions',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'No posee Restricciones',
    },
  },
  {
    timestamps: false,
    tableName: 'restrictions',
  }
);

export default Restriction;
