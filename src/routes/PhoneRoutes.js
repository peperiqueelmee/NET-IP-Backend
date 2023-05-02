import { Router } from 'express';
import { getPhones, getPhonesByStatus } from '../controllers/phoneController.js';

const router = Router();

router.get('/:phone_number?', getPhones);
router.get('/status/:status', getPhonesByStatus);

export default router;
