import pool from '../config/db.js';

export const teacherModels = {
  // Get all teachers
  getAllTeachers: async () => {
    const query = `
      SELECT t.*, u.id as user_id
      FROM teachers t
      LEFT JOIN users u ON t.email = u.email AND u.role = 'teacher'
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get teacher by ID
  getTeacherById: async (id) => {
    const query = `
      SELECT t.*, u.id as user_id
      FROM teachers t
      LEFT JOIN users u ON t.email = u.email AND u.role = 'teacher'
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new teacher
  createTeacher: async (teacherData) => {
    let { name, email, department, specialization, availableDays } = teacherData;
    // Ensure availableDays is a native JS array
    if (!Array.isArray(availableDays)) {
      if (typeof availableDays === 'string') {
        availableDays = availableDays.split(',').map(day => day.trim());
      } else if (!availableDays) {
        availableDays = [];
      } else {
        availableDays = Array.from(availableDays);
      }
    }
    console.log('Creating teacher: availableDays value:', availableDays, 'type:', typeof availableDays, 'isArray:', Array.isArray(availableDays));
    
    const query = `
      INSERT INTO teachers (name, email, department, specialization, available_days)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, email, department, specialization, availableDays]);
    return result.rows[0];
  },

  // Update teacher
  updateTeacher: async (id, teacherData) => {
    let { name, email, department, specialization, availableDays } = teacherData;
    // Ensure availableDays is a native JS array
    if (!Array.isArray(availableDays)) {
      if (typeof availableDays === 'string') {
        availableDays = availableDays.split(',').map(day => day.trim());
      } else if (!availableDays) {
        availableDays = [];
      } else {
        availableDays = Array.from(availableDays);
      }
    }
    console.log('Updating teacher: availableDays value:', availableDays, 'type:', typeof availableDays, 'isArray:', Array.isArray(availableDays));
    
    const query = `
      UPDATE teachers 
      SET name = $1, email = $2, department = $3, specialization = $4, available_days = $5
      WHERE id = $6
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, email, department, specialization, availableDays, id]);
    return result.rows[0];
  },

  // Delete teacher
  deleteTeacher: async (id) => {
    const query = 'DELETE FROM teachers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}; 