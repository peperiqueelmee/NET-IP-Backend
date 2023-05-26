import Restriction from '../models/Restriction.js';

const getRestrictionsIntercom = async (req, res) => {
  try {
    const restrictionsData = await Restriction.findAll({
      where: { id: [1, 2] },
    });
    res.status(200).json({ code: 200, data: restrictionsData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getRestrictionsIntercom };
