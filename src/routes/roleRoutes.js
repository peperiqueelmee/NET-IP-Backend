import { Router } from 'express';
import { getRoles } from '../controllers/roleController.js';

const router = Router();

router.get('/', getRoles);

export default router;
