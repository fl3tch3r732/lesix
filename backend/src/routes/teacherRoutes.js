import express from 'express';
import { teacherControllers } from '../controllers/teacherControllers.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Teacher CRUD routes
router.get('/', teacherControllers.getAllTeachers);
router.get('/:id', teacherControllers.getTeacherById);
router.post('/', authenticateToken, requireAdmin, teacherControllers.createTeacher);
router.put('/:id', authenticateToken, requireAdmin, teacherControllers.updateTeacher);
router.delete('/:id', authenticateToken, requireAdmin, teacherControllers.deleteTeacher);

// New: Get teachers with their courses
router.get('/with-courses', teacherControllers.getTeachersWithCourses);

export default router; 