import express from 'express';
import { classesController } from '../controllers/classesControllers.js';

const router = express.Router();

// Get all classes
router.get('/', classesController.getAllClasses);

// Get classes by department
router.get('/department/:department', classesController.getClassesByDepartment);

// Get class by ID
router.get('/:id', classesController.getClassById);

// Create new class
router.post('/', classesController.createClass);

// Update class
router.put('/:id', classesController.updateClass);

// Delete class
router.delete('/:id', classesController.deleteClass);

export default router;
