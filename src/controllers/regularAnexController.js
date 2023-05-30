import { Sequelize } from 'sequelize';
import Department from '../models/Department.js';
import RegularAnex from '../models/RegularAnex.js';
import Restriction from '../models/Restriction.js';
import Status from '../models/Status.js';
import TransportType from '../models/TransportType.js';

const createRegularAnex = async (req, res) => {
  const { anexNumber, password, transportType, department } = req.body;

  try {
    const anexData = await RegularAnex.create({
      anex_number: anexNumber,
      password,
      transport_id: transportType,
      departments_id: department,
    });
    res.status(200).json({ code: 200, data: anexData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getNormalAnex = async (req, res) => {
  const { anexNumber } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const anexData = await RegularAnex.findAndCountAll({
      where: anexNumber ? { anex_number: anexNumber } : {},
      include: [
        {
          model: TransportType,
          attributes: ['description'],
        },
        {
          model: Department,
          attributes: ['description'],
        },
        {
          model: Status,
          attributes: ['description'],
        },
        {
          model: Restriction,
          attributes: ['description'],
        },
      ],
      attributes: { exclude: ['password'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['anex_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, data: anexData.rows, total: anexData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getNormalByStatus = async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const anexData = await RegularAnex.findAndCountAll({
      where: { status_id: status },
      include: [
        {
          model: TransportType,
          attributes: ['description'],
        },
        {
          model: Department,
          attributes: ['description'],
        },
        {
          model: Status,
          attributes: ['description'],
        },
        {
          model: Restriction,
          attributes: ['description'],
        },
      ],
      attributes: { exclude: ['password'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['anex_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, data: anexData.rows, total: anexData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getActiveNormalAnexWithDepartmentName = async (req, res) => {
  try {
    const anexData = await RegularAnex.findAndCountAll({
      where: { status_id: 1 },
      include: [
        {
          model: Department,
          attributes: [[Sequelize.literal(`CONCAT(Department.description, ' - ', anex_number)`), 'department_anex']],
        },
      ],
      attributes: {
        exclude: ['id', 'password', 'transport_id', 'departments_id', 'restrictions_id', 'status_id'],
      },
      order: [['anex_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, data: anexData.rows, total: anexData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
export { createRegularAnex, getNormalAnex, getNormalByStatus, getActiveNormalAnexWithDepartmentName };
