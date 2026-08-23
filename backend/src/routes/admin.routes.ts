import { Router } from 'express';
import { createDoctor, addDoctorLeave, getUsers, deleteUser, getAppointments, updateAppointment } from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/doctor', createDoctor);
router.post('/doctor/leave', addDoctorLeave);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointment);

export default router;
