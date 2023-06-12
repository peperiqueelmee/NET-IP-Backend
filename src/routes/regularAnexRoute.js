import { Router } from 'express';
import {
  createRegularAnex,
  getNormalAnex,
  getNormalByStatus,
  getActiveNormalAnexWithDepartmentName,
  changeNormalAnnexStatus,
} from '../controllers/regularAnexController.js';
import { validateCreateNormalAnex, validateChangeNormalAnnexStatus } from '../middlewares/regularAnexMiddleware.js';

const router = Router();

router.post('/create', validateCreateNormalAnex, createRegularAnex);
router.get('/:anexNumber?', getNormalAnex);
router.get('/by-department/active', getActiveNormalAnexWithDepartmentName);
router.get('/status/:status', getNormalByStatus);
router.put('/change-status/:id', validateChangeNormalAnnexStatus, changeNormalAnnexStatus);

export default router;
