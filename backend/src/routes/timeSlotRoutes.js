import express from 'express';
import { timeSlotControllers } from '../controllers/timeSlotControllers.js';
import { authenticateToken, requireAdmin, requireAdminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

// Time slot CRUD routes
router.get('/', timeSlotControllers.getAllTimeSlots);
router.get('/:id', timeSlotControllers.getTimeSlotById);
router.post('/', authenticateToken, requireAdmin, timeSlotControllers.createTimeSlot);
router.put('/:id', authenticateToken, requireAdmin, timeSlotControllers.updateTimeSlot);
router.delete('/:id', authenticateToken, requireAdmin, timeSlotControllers.deleteTimeSlot);
// Teacher confirms presence for a timeslot
router.post('/:id/confirm', authenticateToken, requireAdminOrTeacher, timeSlotControllers.confirmTimeSlot);

export default router; 