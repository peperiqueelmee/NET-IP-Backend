import { Sequelize } from 'sequelize';
import Client from '../models/Client.js';
import ClientPhone from '../models/ClientPhone.js';
import Status from '../models/Status.js';
import { removeWhitespace } from '../utils/utils.js';

const getPhones = async (req, res) => {
  const { phone_number } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const phoneData = await ClientPhone.findAndCountAll({
      where: phone_number ? { phone_number: removeWhitespace(phone_number) } : {},
      include: [
        {
          model: Client,
          attributes: [[Sequelize.literal('CONCAT(names, " ", lastnames)'), 'fullName'], 'rut', 'address'],
        },
        {
          model: Status,
          attributes: ['description'],
        },
      ],
      attributes: ['id', 'phone_number', 'status_id'],
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    return res.status(200).json({ code: 200, data: phoneData.rows, total: phoneData.count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPhonesByStatus = async (req, res) => {
  const { status } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const phoneData = await ClientPhone.findAndCountAll({
      where: { status_id: status },
      include: [
        {
          model: Client,
          attributes: [[Sequelize.literal('CONCAT(names, " ", lastnames)'), 'fullName'], 'rut', 'address'],
        },
        {
          model: Status,
          attributes: ['description'],
        },
      ],
      attributes: ['id', 'phone_number', 'status_id'],
      attributes: ['id', 'phone_number', 'status_id'],
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    return res.status(200).json({ code: 200, data: phoneData.rows, total: phoneData.count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPhones, getPhonesByStatus };

