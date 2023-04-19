import { Router } from 'express';
import { registerEmployee, authenticateEmployee } from '../controllers/employeeController.js';

const router = Router();

router.post('/', registerEmployee);
router.post('/login', authenticateEmployee);

export default router;
