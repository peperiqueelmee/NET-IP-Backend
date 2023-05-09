import { Router } from 'express';
import { getEmployeeStatus } from '../controllers/StatusController.js';

const router = Router();

router.get('/employee', getEmployeeStatus);

export default router;
