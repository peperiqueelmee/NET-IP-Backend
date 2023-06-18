import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Sequelize from 'sequelize';
import { sequelize } from '../config/db.js';
import Employee from './Employee.js';
import SysEvent from './SysEvents.js';

const Log = sequelize.define(
  'log',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    log_time: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    log_description: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    employee_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    event_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    formatted_log_time: {
      type: Sequelize.VIRTUAL,
      get() {
        const timeZone = 'America/Santiago';
        return formatLogTime(this.log_time, timeZone);
      },
    },
  },
  {
    timestamps: false,
    tableName: 'log',
  }
);

Log.belongsTo(Employee, { foreignKey: 'employee_id' });
Log.belongsTo(SysEvent, { foreignKey: 'event_id' });

function formatLogTime(logTime, timeZone) {
  const zonedDate = utcToZonedTime(logTime, timeZone);
  return format(zonedDate, 'dd/MM/yyyy - HH:mm:ss');
}

export default Log;
