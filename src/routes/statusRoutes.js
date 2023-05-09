import { Router } from 'express';
import { getEmployeeStatus } from '../controllers/statusController.js';

const router = Router();

router.get('/employee', getEmployeeStatus);

export default router;
