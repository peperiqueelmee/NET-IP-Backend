import Log from '../models/Log.js';
import Employee from '../models/Employee.js';
import SysEvent from '../models/SysEvents.js';
import { Sequelize } from 'sequelize';

const createLog = async (req, res) => {
  const { logDescription, employeeId, eventId } = req.body;

  try {
    const logData = await Log.create({
      log_time: new Date(),
      log_description: logDescription,
      employee_id: employeeId,
      event_id: eventId,
    });
    res.status(200).json({ code: 200, data: logData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getLogs = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const logData = await Log.findAndCountAll({
      include: [
        {
          model: Employee,
          attributes: [[Sequelize.literal('CONCAT(names, " ", lastnames)'), 'fullName'], 'username'],
        },
        {
          model: SysEvent,
          attributes: ['id', 'event_type'],
        },
      ],
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['log_time', 'DESC']],
    });

    res.status(200).json({ code: 200, total: logData.count, data: logData.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { createLog, getLogs };
