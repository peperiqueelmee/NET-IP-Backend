import Troncal from '../models/Troncal.js';
import { errorResponse } from '../utils/utils.js';
import {
  alreadyRegistered,
  validateAnnexExistence,
  validateFullFields,
  validateNumberAnex,
} from '../utils/Validations.js';

const validateCreateTroncal = async (req, res, next) => {
  const { number, transportTypeId } = req.body;

  if (!validateFullFields([number, transportTypeId])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }

  if (!validateNumberAnex(number, 10000, 19999)) {
    return errorResponse(res, 409, `El Troncal debe estar en el rango de 10000-19999.`, 'Troncal');
  }

  try {
    if (await alreadyRegistered(Troncal, 'number', number)) {
      return errorResponse(res, 409, 'Troncal ya registrado.', 'Troncal');
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateChangeTroncalStatus = validateAnnexExistence(Troncal, 'Troncal no registrado');

export { validateCreateTroncal, validateChangeTroncalStatus };
