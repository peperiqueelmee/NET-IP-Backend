import { Router } from 'express';
import {
  createMultiCallRinging,
  getMultiCallRinging,
  getMultiCallRingingByStatus,
} from '../controllers/multiCallRingingController.js';
import { validateMultiCallRinging } from '../middlewares/multiCallRingingMiddlewares.js';

const router = Router();

router.post('/create', validateMultiCallRinging, createMultiCallRinging);
router.get('/:mcrNumber?', getMultiCallRinging);
router.get('/status/:status', getMultiCallRingingByStatus);

export default router;
