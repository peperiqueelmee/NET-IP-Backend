import RegularAnex from '../models/RegularAnex.js';
import { errorResponse } from '../utils/utils.js';
import {
  alreadyRegistered,
  validateFullFields,
  validateNumberAnex,
  ValidatePasswordStrength,
} from '../utils/Validations.js';

const validateCreateNormalAnex = async (req, res, next) => {
  const { anexNumber, password, transportType, department } = req.body;

  if (!validateFullFields([anexNumber, password, transportType, department])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (!validateNumberAnex(anexNumber, 1000, 9999)) {
    return errorResponse(res, 409, 'El Anexo debe estar en el rango de 1000-9999.', 'Anex');
  }

  try {
    if (await alreadyRegistered(RegularAnex, 'anex_number', anexNumber)) {
      return errorResponse(res, 409, 'Anexo ya registrado.', 'Anex');
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

export { validateCreateNormalAnex };
