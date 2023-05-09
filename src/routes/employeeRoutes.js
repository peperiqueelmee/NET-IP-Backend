import { Router } from 'express';
import {
	authenticateEmployee,
	getEmployees,
	getEmployeesByStatus,
	getNameEmployee,
	newEmployeePassword,
	registerEmployee,
	sendEmailToRecoverPassword,
	updateEmployee,
} from '../controllers/employeeController.js';
import {
	validateDataEmployeeRecoverPassword,
	validateDataNewPassword,
	validateEmployeeAuthentication,
	validateEmployeeRegistration,
	validateEmployeeUpdate,
	validateToken,
	validateUserStatus,
} from '../middlewares/employeeMiddlewares.js';

const router = Router();

router.get('/employees/:rut?', getEmployees);
router.get('/employees/status/:status', getEmployeesByStatus);
router.post('/', validateEmployeeRegistration, registerEmployee);
router.post('/login', validateEmployeeAuthentication, authenticateEmployee);
router.post('/forgot-password', validateDataEmployeeRecoverPassword, sendEmailToRecoverPassword);
router
	.route('/forgot-password/:token')
	.get([validateToken, validateUserStatus], getNameEmployee)
	.post(validateDataNewPassword, newEmployeePassword);
router.put('/update/:id', validateEmployeeUpdate, updateEmployee);

export default router;
