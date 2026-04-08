import express from 'express';
import { courseControllers } from '../controllers/courseControllers.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Course CRUD routes
router.get('/', courseControllers.getAllCourses);
router.get('/:id', courseControllers.getCourseById);
router.post('/', authenticateToken, requireAdmin, courseControllers.createCourse);
router.put('/:id', authenticateToken, requireAdmin, courseControllers.updateCourse);
router.delete('/:id', authenticateToken, requireAdmin, courseControllers.deleteCourse);

export default router; 