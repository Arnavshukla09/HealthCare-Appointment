import { Router } from 'express';
import { submitPostVisitNotes } from '../controllers/doctor.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('doctor'));

router.post('/post-visit', submitPostVisitNotes);

export default router;
