import NormalAnex from '../models/NormalAnex.js';
import { errorResponse } from '../utils/utils.js';
import { validateNumberAnex } from '../utils/Validations.js';

const validateCreateNormalAnex = async (req, res, next) => {
  const { anexNumber } = req.body;

  if (!validateNumberAnex(anexNumber, 1000, 9999)) {
    return errorResponse(res, 409, 'El Anexo debe estar en el rango de 1000-9999.');
  }
  next();
};

export { validateCreateNormalAnex };
