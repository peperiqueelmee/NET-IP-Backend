import Restriction from '../models/Restriction.js';
import Status from '../models/Status.js';
import TransportType from '../models/TransportType.js';
import Troncal from '../models/Troncal.js';
import { APPLICATION_STATES, changeAnnexStatus } from '../utils/utils.js';

const createTroncal = async (req, res) => {
  const { number, transportTypeId } = req.body;

  try {
    const troncalData = await Troncal.create({
      number,
      transport_id: transportTypeId,
    });
    res.status(200).json({ code: 200, data: troncalData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getTroncal = async (req, res) => {
  const { troncalNumber } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const troncalData = await Troncal.findAndCountAll({
      where: troncalNumber ? { number: troncalNumber } : {},
      include: [
        {
          model: TransportType,
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
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['number', 'ASC']],
    });

    return res.status(200).json({ code: 200, total: troncalData.count, data: troncalData.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getTroncalByStatus = async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const troncalData = await Troncal.findAndCountAll({
      where: { status_id: status },
      include: [
        {
          model: TransportType,
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
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['number', 'ASC']],
    });

    return res.status(200).json({ code: 200, total: troncalData.count, data: troncalData.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const changeTroncalStatus = changeAnnexStatus(APPLICATION_STATES);

export { createTroncal, getTroncal, getTroncalByStatus, changeTroncalStatus };
