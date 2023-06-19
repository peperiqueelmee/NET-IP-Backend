import { Router } from 'express';
import {
  changeTroncalStatus,
  createTroncal,
  getTroncal,
  getTroncalByStatus,
} from '../controllers/troncalController.js';
import { validateChangeTroncalStatus, validateCreateTroncal } from '../middlewares/troncalMiddleware.js';

const router = Router();

router.post('/create', validateCreateTroncal, createTroncal);
router.get('/:troncalNumber?', getTroncal);
router.get('/status/:status', getTroncalByStatus);
router.put('/change-status/:id', validateChangeTroncalStatus, changeTroncalStatus);

export default router;
