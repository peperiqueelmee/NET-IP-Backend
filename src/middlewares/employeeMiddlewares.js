import Employee from '../models/Employee.js';
import { ValidatePasswordStrength, alreadyRegistered, validateFullFields } from '../utils/Validations.js';
import { errorResponse, generateId, generateJWT, getFirstName, validateRut } from '../utils/utils.js';

const validateEmployeeRegistration = async (req, res, next) => {
  const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;

  //Validations fields and format
  if (!validateFullFields([rut, names, lastnames, role_id, email, username, emp_password])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (!validateRut(rut)) {
    return errorResponse(res, 409, 'RUT y/o formato incorrecto.', 'RUT');
  }

  try {
    // Validate duplicate data.
    const isRutAlreadyRegistered = await alreadyRegistered(Employee, 'rut', rut);
    if (isRutAlreadyRegistered) {
      return errorResponse(res, 409, 'RUT ya registrado.', 'RUT');
    }
    const isEmailAlreadyRegistered = await alreadyRegistered(Employee, 'email', email);
    if (isEmailAlreadyRegistered) {
      return errorResponse(res, 409, 'Email ya registrado.', 'Email');
    }
    const usernameAlreadyRegistered = await alreadyRegistered(Employee, 'username', username);
    if (usernameAlreadyRegistered) {
      return errorResponse(res, 409, 'Nombre de usuario ya registrado.', 'Username');
    }

    if (!ValidatePasswordStrength(emp_password)) {
      return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.', 'Password');
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateEmployeeAuthentication = async (req, res, next) => {
  const { username, emp_password } = req.body;
  const userIsInactive = 2;

  if (!validateFullFields([username, emp_password])) {
    return errorResponse(res, 400, 'Enter all the information.');
  }

  try {
    const getEmployee = await Employee.findOne({ where: { username } });
    if (!getEmployee) {
      return errorResponse(res, 404, 'Usuario o contraseña incorrecta.');
    }
    const passwordIsValid = await getEmployee.checkPassword(emp_password);
    if (!passwordIsValid) {
      return errorResponse(res, 401, 'Usuario o contraseña incorrecta.');
    }
    if (getEmployee.status_id === userIsInactive) {
      return errorResponse(res, 403, 'Cuenta desactivada, comunícate con soporte.');
    }
    // Attach the employee object.
    req.employee = {
      username,
      email: getEmployee.email,
      token: generateJWT(getEmployee.employee_id),
      rut: getEmployee.rut,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateDataEmployeeRecoverPassword = async (req, res, next) => {
  const { username } = req.body;
  const userIsInactive = 2;

  if (!validateFullFields([username])) {
    return errorResponse(res, 400, 'Enter all the information.');
  }

  try {
    // Validate username.
    const getEmployee = await Employee.findOne({ where: { username } });
    if (!getEmployee) {
      return errorResponse(res, 404, 'Usuario no registrado.');
    }
    if (getEmployee.status_id === userIsInactive) {
      return errorResponse(res, 403, 'Cuenta desactivada, comunícate con soporte.');
    }

    getEmployee.token = generateId();
    await getEmployee.save();
    // Attach the employee object.
    req.employee = {
      name: getFirstName(getEmployee.names),
      email: getEmployee.email,
      token: getEmployee.token,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const tokenIsValid = await Employee.findOne({ where: { token } });
    if (!tokenIsValid) {
      return errorResponse(res, 401, 'Enlace invalido.');
    }
    // Attach the employee object.
    req.employee = {
      name: getFirstName(tokenIsValid.names),
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateUserStatus = async (req, res, next) => {
  const { token } = req.params;
  const userIsInactive = 2;

  try {
    const getEmployee = await Employee.findOne({ where: { token } });
    if (getEmployee.status_id === userIsInactive) {
      return errorResponse(res, 403, 'Cuenta desactivada, comunícate con soporte.');
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateDataNewPassword = async (req, res, next) => {
  const { token } = req.params;
  const { emp_password } = req.body;

  if (!validateFullFields([emp_password])) {
    return errorResponse(res, 400, 'Por favor completa todos los campos.');
  }

  try {
    const tokenIsValid = await Employee.findOne({ where: { token } });
    if (!tokenIsValid) {
      return errorResponse(res, 401, 'Invalid Token.');
    }
    // Attach the employee object.
    req.employee = {
      employee: tokenIsValid,
      emp_password,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateEmployeeUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { rut, email, username, emp_password } = req.body;

  try {
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) {
      return res.status(404).json({ code: 404, message: 'Employee not found.' });
    }
    // Validate duplicate data.
    if (rut) {
      if (!validateRut(rut)) {
        return errorResponse(res, 409, 'RUT y/o formato incorrecto.', 'RUT');
      }
      const isRutAlreadyRegistered = await alreadyRegistered(Employee, 'rut', rut, id);
      if (isRutAlreadyRegistered) {
        return errorResponse(res, 409, 'RUT ya registrado.', 'RUT');
      }
    }
    if (email) {
      const isEmailAlreadyRegistered = await alreadyRegistered(Employee, 'email', email, id);
      if (isEmailAlreadyRegistered) {
        return errorResponse(res, 409, 'Email ya registrado.', 'Email');
      }
    }
    if (username) {
      const usernameAlreadyRegistered = await alreadyRegistered(Employee, 'username', username, id);
      if (usernameAlreadyRegistered) {
        return errorResponse(res, 409, 'Username ya registrado.', 'Username');
      }
    }

    if (emp_password && !ValidatePasswordStrength(emp_password)) {
      return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.', 'Password');
    }
    // Attach the employee object.
    req.employee = {
      employee,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  validateDataEmployeeRecoverPassword,
  validateDataNewPassword,
  validateEmployeeAuthentication,
  validateEmployeeRegistration,
  validateEmployeeUpdate,
  validateToken,
  validateUserStatus,
};
