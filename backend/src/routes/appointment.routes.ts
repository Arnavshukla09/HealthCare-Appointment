import { Router } from 'express';
import { holdSlot, bookAppointment, getMyAppointments } from '../controllers/appointment.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes below
router.use(protect);

router.post('/hold', authorize('patient'), holdSlot);
router.post('/book', authorize('patient'), bookAppointment);
router.get('/', getMyAppointments);

export default router;
