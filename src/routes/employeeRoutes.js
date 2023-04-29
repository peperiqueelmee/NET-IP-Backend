import { Router } from 'express';
import {
	authenticateEmployee,
	getNameEmployee,
	newEmployeePassword,
	registerEmployee,
	sendEmailToRecoverPassword,
	getEmployees,
	getEmployeesByStatus,
} from '../controllers/employeeController.js';
import {
	validateDataEmployeeRecoverPassword,
	validateDataNewPassword,
	validateEmployeeAuthentication,
	validateEmployeeRegistration,
	validateToken,
} from '../middlewares/employeeMiddlewares.js';

const router = Router();

router.get('/employees/:rut?', getEmployees);
router.get('/employees/status/:status', getEmployeesByStatus);
router.post('/', validateEmployeeRegistration, registerEmployee);
router.post('/login', validateEmployeeAuthentication, authenticateEmployee);
router.post('/forgot-password', validateDataEmployeeRecoverPassword, sendEmailToRecoverPassword);
router
	.route('/forgot-password/:token')
	.get(validateToken, getNameEmployee)
	.post(validateDataNewPassword, newEmployeePassword);

export default router;
