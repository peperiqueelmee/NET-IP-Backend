import Role from '../models/Role.js';

const getRoles = async (req, res) => {
	try {
		const roles = await Role.findAll();
		res.status(200).json({ code: 200, data: roles });
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

export { getRoles };
