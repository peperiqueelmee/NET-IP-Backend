import { Op } from 'sequelize';

const validateFullFields = (array) =>
	array.every((element) => element !== '' && element !== null && element !== undefined);

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

export { validateFullFields, ValidatePasswordStrength, alreadyRegistered };
