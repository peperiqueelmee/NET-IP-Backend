import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import Department from './Department.js';
import Restriction from './Restriction.js';
import Status from './Status.js';
import TransportType from './TransportType.js';

const MultiCallRinging = sequelize.define(
  'multi_call_ringing',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mcr_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    mcr_call_anexes: {
      type: Sequelize.STRING(100),
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
    tableName: 'multi_call_ringing',
    timestamps: false,
    hooks: {
      beforeCreate: async function (multiCallRinging, options) {
        if (multiCallRinging.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          multiCallRinging.password = await bcrypt.hash(multiCallRinging.password, salt);
        }
      },
    },
  }
);

MultiCallRinging.belongsTo(TransportType, { foreignKey: 'transport_id' });
MultiCallRinging.belongsTo(Department, { foreignKey: 'departments_id' });
MultiCallRinging.belongsTo(Restriction, { foreignKey: 'restrictions_id' });
MultiCallRinging.belongsTo(Status, { foreignKey: 'status_id' });

export default MultiCallRinging;
