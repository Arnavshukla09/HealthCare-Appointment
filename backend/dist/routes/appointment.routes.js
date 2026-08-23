"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect all routes below
router.use(auth_middleware_1.protect);
router.post('/hold', (0, auth_middleware_1.authorize)('patient'), appointment_controller_1.holdSlot);
router.post('/book', (0, auth_middleware_1.authorize)('patient'), appointment_controller_1.bookAppointment);
router.get('/', appointment_controller_1.getMyAppointments);
exports.default = router;
