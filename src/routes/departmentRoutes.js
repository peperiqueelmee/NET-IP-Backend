import { Router } from 'express';
import { getDepartments } from '../controllers/departmentController.js';

const router = Router();

router.get('/', getDepartments);

export default router;
