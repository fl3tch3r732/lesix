import { teacherModels } from '../models/teacherModels.js';

export const teacherControllers = {
  // Get all teachers
  getAllTeachers: async (req, res) => {
    try {
      const teachers = await teacherModels.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      console.error('Error getting teachers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get teacher by ID
  getTeacherById: async (req, res) => {
    try {
      const { id } = req.params;
      const teacher = await teacherModels.getTeacherById(id);
      
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      
      res.json(teacher);
    } catch (error) {
      console.error('Error getting teacher:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new teacher
  createTeacher: async (req, res) => {
    try {
      console.log('createTeacher req.body:', req.body);
      // Admin role check
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admin can add teachers' });
      }
      const teacherData = req.body;
      const teacher = await teacherModels.createTeacher(teacherData);
      res.status(201).json(teacher);
    } catch (error) {
      console.error('Error creating teacher:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update teacher
  updateTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const teacherData = req.body;
      const teacher = await teacherModels.updateTeacher(id, teacherData);
      
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      
      res.json(teacher);
    } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete teacher
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const teacher = await teacherModels.deleteTeacher(id);
      
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      
      res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get teachers with their courses
  getTeachersWithCourses: async (req, res) => {
    try {
      const teachers = await teacherModels.getAllTeachers();
      const courseModels = require('../models/courseModels.js').courseModels;
      const courses = await courseModels.getAllCourses();
      // Assign courses to teachers by department
      const teacherList = teachers.map(teacher => ({
        ...teacher,
        courses: courses.filter(course => course.department === teacher.department)
      }));
      res.json(teacherList);
    } catch (error) {
      console.error('Error getting teachers with courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 