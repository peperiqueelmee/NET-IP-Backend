import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import Restriction from './Restriction.js';
import Status from './Status.js';
import TransportType from './TransportType.js';

const Intercom = sequelize.define(
  'intercom',
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
    password: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    intercom_caller: {
      type: Sequelize.INTEGER,
    },
    transport_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    restrictions_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'intercoms',
    timestamps: false,
    hooks: {
      beforeCreate: async function (intercom, options) {
        if (intercom.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          intercom.password = await bcrypt.hash(intercom.password, salt);
        }
      },
    },
  }
);

Intercom.belongsTo(TransportType, { foreignKey: 'transport_id' });
Intercom.belongsTo(Restriction, { foreignKey: 'restrictions_id' });
Intercom.belongsTo(Status, { foreignKey: 'status_id' });

export default Intercom;
