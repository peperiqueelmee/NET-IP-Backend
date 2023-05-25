import { Router } from 'express';
import {
  createRegularAnex,
  getNormalAnex,
  getNormalByStatus,
} from '../controllers/regularAnexController.js';
import { validateCreateNormalAnex } from '../middlewares/regularAnexMiddleware.js';

const router = Router();

router.post('/create', validateCreateNormalAnex,createRegularAnex);
router.get('/:anexNumber?', getNormalAnex);
router.get('/status/:status', getNormalByStatus);

export default router;
