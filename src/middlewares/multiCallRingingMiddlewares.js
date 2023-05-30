import MultiCallRinging from '../models/MultiCallRinging.js';
import { errorResponse } from '../utils/utils.js';
import {
  alreadyRegistered,
  validateFullFields,
  validateNumberAnex,
  ValidatePasswordStrength,
} from '../utils/Validations.js';

const validateMultiCallRinging = async (req, res, next) => {
  const { mcrNumber, password, mcrCallAnexes, transportType, department } = req.body;
  console.log(mcrCallAnexes)

  if (!validateFullFields([mcrNumber, password, mcrCallAnexes, transportType, department])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (!validateNumberAnex(mcrNumber, 30000, 39999)) {
    return errorResponse(res, 409, 'El MCR debe estar en el rango de 30000-39999.', 'MCR');
  }

  try {
    if (await alreadyRegistered(MultiCallRinging, 'mcr_number', mcrNumber)) {
      return errorResponse(res, 409, 'MCR ya registrado.', 'MCR');
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

export { validateMultiCallRinging };
