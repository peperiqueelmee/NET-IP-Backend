import jwt from 'jsonwebtoken';

const errorResponse = (res, code, message, input) => res.status(code).json({ code, message, input });

const generateJWT = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateId = () => {
  return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

function hideEmail(email) {
  const atIndex = email.indexOf('@');
  const username = email.slice(0, atIndex);
  const hiddenUsername =
    username.slice(0, 2) +
    Array(username.length - 2)
      .fill('*')
      .join('');
  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.indexOf('.');
  const hiddenDomain =
    domain.slice(0, 2) +
    Array(dotIndex - 2)
      .fill('*')
      .join('') +
    domain.slice(dotIndex);
  return hiddenUsername + '@' + hiddenDomain;
}

function getFirstName(fullName) {
  const namesArray = fullName.split(' ');
  return namesArray[0];
}

const capitalizeString = str => {
  const words = str.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(' ');
};

const validateRut = rut => {
  if (!rut) return false;

  if (rut.indexOf('-') === -1) return false;
  rut = rut.replace(/\./g, '').replace(/-/g, '');
  let dv = rut.slice(-1).toUpperCase();
  let rutSinDV = rut.slice(0, -1);
  if (!/^\d+$/.test(rutSinDV)) return false;
  let suma = 0,
    factor = 2;
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma += factor * rutSinDV.charAt(i);
    factor = factor === 7 ? 2 : factor + 1;
  }
  let dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = '0';
  else if (dvEsperado === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperado.toString();
  return dv === dvEsperado;
};

const removeWhitespace = string => {
  return string.replace(/\s+/g, '');
};

const APPLICATION_STATES = {
  Active: 1,
  Inactive: 2,
  Blocked: 3,
};

const changeAnnexStatus = APPLICATION_STATES => {
  return async (req, res) => {
    const { annex } = req.annex;

    try {
      annex.status_id =
        annex.status_id === APPLICATION_STATES.Active ? APPLICATION_STATES.Blocked : APPLICATION_STATES.Active;
      await annex.save();
      return res.status(200).json({ code: 200, data: annex });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

export {
  APPLICATION_STATES,
  capitalizeString,
  changeAnnexStatus,
  errorResponse,
  generateId,
  generateJWT,
  getFirstName,
  hideEmail,
  removeWhitespace,
  validateRut,
};
