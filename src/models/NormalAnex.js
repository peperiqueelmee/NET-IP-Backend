import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import AnexType from './anexTypes.js';
import Department from './departments.js';
import TransportType from './transportTypes.js';

const NormalAnex = sequelize.define(
  'normal_anex',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    anex_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    anex_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    transport_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    departments_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'normal_anex',
  }
);

NormalAnex.belongsTo(AnexType, { foreignKey: 'anex_type_id' });
NormalAnex.belongsTo(TransportType, { foreignKey: 'transport_id' });
NormalAnex.belongsTo(Department, { foreignKey: 'departments_id' });

export default NormalAnex;
