import { Router } from 'express';
import { createDoctor, addDoctorLeave } from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/doctor', createDoctor);
router.post('/doctor/leave', addDoctorLeave);

export default router;
