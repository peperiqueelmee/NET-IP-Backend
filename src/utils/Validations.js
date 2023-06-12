import { Op } from 'sequelize';
import { errorResponse } from './utils.js';

const validateFullFields = array => array.every(element => element !== '' && element !== null && element !== undefined);

function ValidatePasswordStrength(password) {
  // The password must be between 6 and 10 characters long
  // and must contain at least one uppercase letter, one lowercase letter, and one number.
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,10}$/;
  return regex.test(password);
}

const alreadyRegistered = async (model, field, value, id = null) => {
  const whereClause = { [field]: value };
  if (id) {
    whereClause.id = { [Op.ne]: id };
  }
  const found = await model.findOne({ where: whereClause });
  return Boolean(found);
};

const validateNumberAnex = (number, rangeMin, RangoMax) => {
  return !isNaN(number) && number >= rangeMin && number <= RangoMax;
};

const validateAnnexExistence = (Model, errorMessage) => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      const annex = await Model.findByPk(id);

      if (!annex) {
        return errorResponse(res, 404, errorMessage);
      }

      req.annex = {
        annex,
      };
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

export { ValidatePasswordStrength, alreadyRegistered, validateAnnexExistence, validateFullFields, validateNumberAnex };
