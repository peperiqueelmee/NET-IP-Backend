import { Router } from 'express';
import { createLog, getLogs } from '../controllers/logController.js';
import Employee from '../models/Employee.js';
import SysEvent from '../models/SysEvents.js';

const router = Router();

router.post('/create', createLog);
router.get('/get', getLogs);

export default router;
