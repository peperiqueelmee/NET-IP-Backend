import { Router } from 'express';
import { getRestrictionsIntercom } from '../controllers/restrictionController.js';

const router = Router();

router.get('/', getRestrictionsIntercom);

export default router;
