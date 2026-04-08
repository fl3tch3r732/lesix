import { courseModels } from '../models/courseModels.js';

export const courseControllers = {
  // Get all courses
  getAllCourses: async (req, res) => {
    try {
      const courses = await courseModels.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error getting courses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get course by ID
  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await courseModels.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json(course);
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new course
  createCourse: async (req, res) => {
    try {
      const courseData = req.body;
      console.log('Received course creation request:', courseData);
      
      const course = await courseModels.createCourse(courseData);
      console.log('Course created successfully:', course);
      
      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Course code already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update course
  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const courseData = req.body;
      const course = await courseModels.updateCourse(id, courseData);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json(course);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete course
  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await courseModels.deleteCourse(id);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      
      // Handle specific error for courses with associated time slots
      if (error.message && error.message.includes('associated time slot')) {
        return res.status(400).json({ 
          error: error.message,
          type: 'HAS_TIMESLOTS'
        });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 