import { Router } from 'express';
import {
  createNormalAnex,
  getNormalAnex,
} from '../controllers/normalAnexController.js';
import { validateCreateNormalAnex } from '../middlewares/normalAnexMiddleware.js';

const router = Router();

router.post('/create', validateCreateNormalAnex, createNormalAnex);
router.get('/:anexNumber?', getNormalAnex);

export default router;
