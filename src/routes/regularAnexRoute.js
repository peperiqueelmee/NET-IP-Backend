import { Router } from 'express';
import {
  createRegularAnex,
  getNormalAnex,
} from '../controllers/regularAnexController.js';
import { validateCreateNormalAnex } from '../middlewares/regularAnexMiddleware.js';

const router = Router();

router.post('/create', validateCreateNormalAnex,createRegularAnex);
router.get('/:anexNumber?', getNormalAnex);

export default router;
