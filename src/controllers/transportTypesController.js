import TransportType from '../models/transportTypes.js';

const getTransportTypes = async (req, res) => {
  try {
    const transportTypeData = await TransportType.findAll();
    res.status(200).json({ code: 200, data: transportTypeData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getTransportTypes };
