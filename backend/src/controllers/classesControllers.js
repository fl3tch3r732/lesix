import { classesModels } from '../models/classesModels.js';

export const classesController = {
  // Get all classes
  getAllClasses: async (req, res) => {
    try {
      const classes = await classesModels.getAllClasses();
      res.json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  },

  // Get classes by department
  getClassesByDepartment: async (req, res) => {
    try {
      const { department } = req.params;
      const classes = await classesModels.getClassesByDepartment(department);
      res.json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  },

  // Get class by ID
  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classData = await classesModels.getClassById(id);
      
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }
      
      res.json(classData);
    } catch (error) {
      console.error('Error fetching class:', error);
      res.status(500).json({ error: 'Failed to fetch class' });
    }
  },

  // Create new class
  createClass: async (req, res) => {
    try {
      const { name, department, student_count } = req.body;
      
      if (!name || !department) {
        return res.status(400).json({ error: 'Name and department are required' });
      }
      
      const newClass = await classesModels.createClass({
        name,
        department,
        student_count: student_count || 0
      });
      
      res.status(201).json(newClass);
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({ error: 'Failed to create class' });
    }
  },

  // Update class
  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, department, student_count } = req.body;
      
      const updatedClass = await classesModels.updateClass(id, {
        name,
        department,
        student_count
      });
      
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
      
      res.json(updatedClass);
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({ error: 'Failed to update class' });
    }
  },

  // Delete class
  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedClass = await classesModels.deleteClass(id);
      
      if (!deletedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
      
      res.json({ message: 'Class deleted successfully', data: deletedClass });
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({ error: 'Failed to delete class' });
    }
  }
};
