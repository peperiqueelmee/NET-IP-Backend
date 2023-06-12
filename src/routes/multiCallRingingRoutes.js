import { Router } from 'express';
import {
  changeMCRStatus,
  createMultiCallRinging,
  getMultiCallRinging,
  getMultiCallRingingByStatus,
} from '../controllers/multiCallRingingController.js';
import { validateChangeMCRStatus, validateMultiCallRinging } from '../middlewares/multiCallRingingMiddlewares.js';

const router = Router();

router.post('/create', validateMultiCallRinging, createMultiCallRinging);
router.get('/:mcrNumber?', getMultiCallRinging);
router.get('/status/:status', getMultiCallRingingByStatus);
router.put('/change-status/:id', validateChangeMCRStatus, changeMCRStatus);

export default router;
