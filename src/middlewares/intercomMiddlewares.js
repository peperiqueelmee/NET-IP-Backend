import Intercom from '../models/Intercom.js';
import { errorResponse } from '../utils/utils.js';
import {
  alreadyRegistered,
  validateFullFields,
  validateNumberAnex,
  ValidatePasswordStrength,
  validateAnnexExistence,
} from '../utils/Validations.js';

const validateCreateIntercom = async (req, res, next) => {
  const { intercomNumber, password, intercomCaller, transportTypeId, restrictionId } = req.body;

  if (!validateFullFields([intercomNumber, password, transportTypeId, restrictionId])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (restrictionId === 2 && !intercomCaller) {
    return errorResponse(res, 400, 'Selecciona el anexo de llamadas restringidas.');
  }
  if (!validateNumberAnex(intercomNumber, 20000, 29999)) {
    return errorResponse(res, 409, `El Intercomunicador debe estar en el rango de 20000-29999.`, 'Intercom');
  }

  try {
    if (await alreadyRegistered(Intercom, 'number', intercomNumber)) {
      return errorResponse(res, 409, 'Intercomunicador ya registrado.', 'Intercom');
    }
    if (!ValidatePasswordStrength(password)) {
      return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.', 'Password');
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateChangeIntercomStatus = validateAnnexExistence(Intercom, 'Intercomunicador no registrado');

export { validateCreateIntercom, validateChangeIntercomStatus };
