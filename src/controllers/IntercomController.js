import Intercom from '../models/Intercom.js';
import Restriction from '../models/Restriction.js';
import Status from '../models/Status.js';
import TransportType from '../models/TransportType.js';
import { APPLICATION_STATES, changeAnnexStatus } from '../utils/utils.js';

const createIntercom = async (req, res) => {
  const { intercomNumber, password, intercomCaller, transportTypeId, restrictionId } = req.body;

  try {
    const intercomData = await Intercom.create({
      intercom_number: intercomNumber,
      password,
      intercom_caller: intercomCaller,
      transport_id: transportTypeId,
      restrictions_id: restrictionId,
    });
    res.status(200).json({ code: 200, data: intercomData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getIntercom = async (req, res) => {
  const { intercomNumber } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const intercomData = await Intercom.findAndCountAll({
      where: intercomNumber ? { intercom_number: intercomNumber } : {},
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
      attributes: { exclude: ['password'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['intercom_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, data: intercomData.rows, total: intercomData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getIntercomByStatus = async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const intercomData = await Intercom.findAndCountAll({
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
      attributes: { exclude: ['password'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['intercom_number', 'ASC']],
    });

    return res.status(200).json({ code: 200, data: intercomData.rows, total: intercomData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const changeIntercomStatus = changeAnnexStatus(APPLICATION_STATES);

export { createIntercom, getIntercom, getIntercomByStatus, changeIntercomStatus };
