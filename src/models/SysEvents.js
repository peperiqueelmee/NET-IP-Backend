import { Sequelize } from 'sequelize';
import { sequelize } from '../config/db.js';

const SysEvent = sequelize.define(
  'sys_event',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_type: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
  },
  {
    tableName: 'sys_events',
  }
);

export default SysEvent;
