import pool from '../config/db.js';

export const courseModels = {
  // Get all courses
  getAllCourses: async () => {
    const query = 'SELECT * FROM courses ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new course
  createCourse: async (courseData) => {
    const { name, code, department, credits, hoursPerWeek } = courseData;
    const allowedDepartments = ['GI', 'ASR', 'GL', 'GRT'];
    if (!allowedDepartments.includes(department)) {
      throw new Error('Invalid department. Allowed values: GI, ASR, GL, GRT');
    }
    
    const query = `
      INSERT INTO courses (name, code, department, credits, hours_per_week)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, code, department, credits, hoursPerWeek]);
    return result.rows[0];
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const { name, code, department, credits, hoursPerWeek } = courseData;
    const allowedDepartments = ['GI', 'ASR', 'GL', 'GRT'];
    if (!allowedDepartments.includes(department)) {
      throw new Error('Invalid department. Allowed values: GI, ASR, GL, GRT');
    }
    
    const query = `
      UPDATE courses 
      SET name = $1, code = $2, department = $3, credits = $4, hours_per_week = $5
      WHERE id = $6
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, code, department, credits, hoursPerWeek, id]);
    return result.rows[0];
  },

  // Delete course
  deleteCourse: async (id) => {
    // First check if the course has associated time slots
    const checkQuery = 'SELECT COUNT(*) as count FROM time_slots WHERE course_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    const timeSlotCount = parseInt(checkResult.rows[0].count);
    
    if (timeSlotCount > 0) {
      throw new Error(`Cannot delete course: It has ${timeSlotCount} associated time slot(s) in the timetable. Please remove the time slots first.`);
    }
    
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}; 