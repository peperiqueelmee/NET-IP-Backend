import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import AnexType from './AnexType.js';
import Department from './Department.js';
import Restriction from './Restriction.js';
import Status from './Status.js';
import TransportType from './TransportType.js';

const RegularAnex = sequelize.define(
  'regular_anex',
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
      defaultValue: 1,
    },
    transport_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    departments_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    restrictions_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    tableName: 'regular_anexes',
    hooks: {
      beforeCreate: async function (regular_anex, options) {
        if (regular_anex.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          regular_anex.password = await bcrypt.hash(regular_anex.password, salt);
        }
      },
    },
  }
);

RegularAnex.belongsTo(AnexType, { foreignKey: 'anex_type_id' });
RegularAnex.belongsTo(TransportType, { foreignKey: 'transport_id' });
RegularAnex.belongsTo(Department, { foreignKey: 'departments_id' });
RegularAnex.belongsTo(Restriction, { foreignKey: 'restrictions_id' });
RegularAnex.belongsTo(Status, { foreignKey: 'status_id' });

export default RegularAnex;
