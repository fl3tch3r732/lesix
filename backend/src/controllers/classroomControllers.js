import { classroomModels } from '../models/classroomModels.js';

export const classroomControllers = {
  // Get all classrooms
  getAllClassrooms: async (req, res) => {
    try {
      const classrooms = await classroomModels.getAllClassrooms();
      res.json(classrooms);
    } catch (error) {
      console.error('Error getting classrooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get classroom by ID
  getClassroomById: async (req, res) => {
    try {
      const { id } = req.params;
      const classroom = await classroomModels.getClassroomById(id);
      
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      
      res.json(classroom);
    } catch (error) {
      console.error('Error getting classroom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new classroom
  createClassroom: async (req, res) => {
    try {
      const classroomData = req.body;
      const classroom = await classroomModels.createClassroom(classroomData);
      res.status(201).json(classroom);
    } catch (error) {
      console.error('Error creating classroom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update classroom
  updateClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const classroomData = req.body;
      const classroom = await classroomModels.updateClassroom(id, classroomData);
      
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      
      res.json(classroom);
    } catch (error) {
      console.error('Error updating classroom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete classroom
  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const classroom = await classroomModels.deleteClassroom(id);
      
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      
      res.json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      console.error('Error deleting classroom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 