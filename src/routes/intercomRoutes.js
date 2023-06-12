import { Router } from 'express';
import {
  changeIntercomStatus,
  createIntercom,
  getIntercom,
  getIntercomByStatus,
} from '../controllers/IntercomController.js';
import { validateChangeIntercomStatus, validateCreateIntercom } from '../middlewares/intercomMiddlewares.js';

const router = Router();

router.post('/create', validateCreateIntercom, createIntercom);
router.get('/:intercomNumber?', getIntercom);
router.get('/status/:status', getIntercomByStatus);
router.put('/change-status/:id', validateChangeIntercomStatus, changeIntercomStatus);

export default router;
