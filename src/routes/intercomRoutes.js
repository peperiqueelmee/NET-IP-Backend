import { Router } from 'express';
import { createIntercom, getIntercom, getIntercomByStatus } from '../controllers/IntercomController.js';
import { validateCreateIntercom } from '../middlewares/intercomMiddlewares.js';

const router = Router();

router.post('/create', validateCreateIntercom, createIntercom);
router.get('/:intercomNumber?', getIntercom);
router.get('/status/:status', getIntercomByStatus);

export default router;
