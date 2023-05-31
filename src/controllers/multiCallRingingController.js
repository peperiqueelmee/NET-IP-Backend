import Department from '../models/Department.js';
import MultiCallRinging from '../models/MultiCallRinging.js';
import Restriction from '../models/Restriction.js';
import Status from '../models/Status.js';
import TransportType from '../models/TransportType.js';

const createMultiCallRinging = async (req, res) => {
  const { mcrNumber, password, mcrCallAnexes, transportTypeId, departmentId } = req.body;

  try {
    const anexData = await MultiCallRinging.create({
      mcr_number: mcrNumber,
      password,
      mcr_call_anexes: mcrCallAnexes,
      transport_id: transportTypeId,
      departments_id: departmentId,
    });
    res.status(200).json({ code: 200, data: anexData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getMultiCallRinging = async (req, res) => {
  const { mcrNumber } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const mcrData = await MultiCallRinging.findAndCountAll({
      where: mcrNumber ? { mcr_number: mcrNumber } : {},
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
      order: [['mcr_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, total: mcrData.count, data: mcrData.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getMultiCallRingingByStatus = async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const mcrData = await MultiCallRinging.findAndCountAll({
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
      order: [['mcr_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, total: mcrData.count, data: mcrData.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { createMultiCallRinging, getMultiCallRinging, getMultiCallRingingByStatus };
