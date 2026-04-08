import express from 'express';
import { classroomControllers } from '../controllers/classroomControllers.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Classroom CRUD routes
router.get('/', classroomControllers.getAllClassrooms);
router.get('/:id', classroomControllers.getClassroomById);
router.post('/', authenticateToken, requireAdmin, classroomControllers.createClassroom);
router.put('/:id', authenticateToken, requireAdmin, classroomControllers.updateClassroom);
router.delete('/:id', authenticateToken, requireAdmin, classroomControllers.deleteClassroom);

export default router; 