import Department from '../models/Department.js';

const getDepartments = async (req, res) => {
  try {
    const departmentsData = await Department.findAll();
    res.status(200).json({ code: 200, data: departmentsData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getDepartments };
