import Status from '../models/Status.js';

const getEmployeeStatus = async (req, res) => {
	try {
		const employeeStatusData = await Status.findAll({
			where: {
				id: [1, 2],
			},
		});
		res.status(200).json({ code: 200, data: employeeStatusData });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export { getEmployeeStatus };
