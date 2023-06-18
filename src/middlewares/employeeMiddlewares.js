import Employee from '../models/Employee.js';
import { ValidatePasswordStrength, alreadyRegistered, validateFullFields } from '../utils/Validations.js';
import { errorResponse, generateId, generateJWT, getFirstName, validateRut } from '../utils/utils.js';

const validateEmployeeRegistration = async (req, res, next) => {
  const { rut, names, lastnames, role_id, email, username, emp_password } = req.body;

  if (!validateFullFields([rut, names, lastnames, role_id, email, username, emp_password])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (!validateRut(rut)) {
    return errorResponse(res, 409, 'RUT y/o formato incorrecto.', 'RUT');
  }

  try {
    if (await alreadyRegistered(Employee, 'rut', rut)) {
      return errorResponse(res, 409, 'RUT ya registrado.', 'RUT');
    }
    if (await alreadyRegistered(Employee, 'email', email)) {
      return errorResponse(res, 409, 'Email ya registrado.', 'Email');
    }
    if (await alreadyRegistered(Employee, 'username', username)) {
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
    const employee = await Employee.findOne({ where: { username } });
    if (!employee) {
      return errorResponse(res, 404, 'Usuario o contraseña incorrecta.');
    }
    if (!(await employee.checkPassword(emp_password))) {
      return errorResponse(res, 401, 'Usuario o contraseña incorrecta.');
    }
    if (employee.status_id === userIsInactive) {
      return errorResponse(res, 403, 'Cuenta desactivada, comunícate con soporte.');
    }

    console.log(employee);
    // Attach the employee object.
    req.employee = {
      id: employee.id,
      username,
      email: employee.email,
      token: generateJWT(employee.employee_id),
      rut: employee.rut,
      role: employee.role_id,
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
    const employee = await Employee.findOne({ where: { username } });
    if (!employee) {
      return errorResponse(res, 404, 'Usuario no registrado.');
    }
    if (employee.status_id === userIsInactive) {
      return errorResponse(res, 403, 'Cuenta desactivada, comunícate con soporte.');
    }

    employee.token = generateId();
    await employee.save();
    // Attach the employee object.
    req.employee = {
      name: getFirstName(employee.names),
      email: employee.email,
      token: employee.token,
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
    const employee = await Employee.findOne({ where: { token } });
    if (!employee) {
      return errorResponse(res, 401, 'Enlace invalido.');
    }
    // Attach the employee object.
    req.employee = {
      name: getFirstName(employee.names),
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
    const employee = await Employee.findOne({ where: { token } });
    if (employee.status_id === userIsInactive) {
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
    const employee = await Employee.findOne({ where: { token } });
    if (!employee) {
      return errorResponse(res, 401, 'Enlace invalido.');
    }
    // Attach the employee object.
    req.employee = {
      employee,
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
    if (rut && !validateRut(rut)) {
      return errorResponse(res, 409, 'RUT y/o formato incorrecto.', 'RUT');
    }
    if (rut && (await alreadyRegistered(Employee, 'rut', rut, id))) {
      return errorResponse(res, 409, 'RUT ya registrado.', 'RUT');
    }
    if (email && (await alreadyRegistered(Employee, 'email', email, id))) {
      return errorResponse(res, 409, 'Email ya registrado.', 'Email');
    }
    if (username && (await alreadyRegistered(Employee, 'username', username, id))) {
      return errorResponse(res, 409, 'Username ya registrado.', 'Username');
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
