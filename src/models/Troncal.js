import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';
import Restriction from './Restriction.js';
import Status from './Status.js';
import TransportType from './TransportType.js';

const Troncal = sequelize.define(
  'troncal',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    transport_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    restrictions_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'troncals',
    timestamps: false,
  }
);

Troncal.belongsTo(TransportType, { foreignKey: 'transport_id' });
Troncal.belongsTo(Restriction, { foreignKey: 'restrictions_id' });
Troncal.belongsTo(Status, { foreignKey: 'status_id' });

export default Troncal;
