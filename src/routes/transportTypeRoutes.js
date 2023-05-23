import { Router } from 'express';
import { getTransportTypes } from '../controllers/transportTypesController.js';

const router = Router();

router.get('/', getTransportTypes);

export default router;
