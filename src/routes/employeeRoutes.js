import { Router } from 'express';
import {
	authenticateEmployee,
	checkToken,
	newEmployeePassword,
	registerEmployee,
	sendEmailToRecoverPassword,
} from '../controllers/employeeController.js';

const router = Router();

router.post('/', registerEmployee);
router.post('/login', authenticateEmployee);
router.post('/forgot-password', sendEmailToRecoverPassword);
router.route('/forgot-password/:token').get(checkToken).post(newEmployeePassword);

export default router;
