import pool from '../config/db.js';

export const classesModels = {
  // Get all classes
  getAllClasses: async () => {
    const query = `
      SELECT * FROM classes
      ORDER BY name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get classes by department
  getClassesByDepartment: async (department) => {
    const query = `
      SELECT * FROM classes
      WHERE department = $1
      ORDER BY name ASC
    `;
    const result = await pool.query(query, [department]);
    return result.rows;
  },

  // Get class by ID
  getClassById: async (id) => {
    const query = `
      SELECT * FROM classes
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new class
  createClass: async (classData) => {
    const { name, department, student_count } = classData;
    
    const query = `
      INSERT INTO classes (name, department, student_count)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, department, student_count]);
    return result.rows[0];
  },

  // Update class
  updateClass: async (id, classData) => {
    const { name, department, student_count } = classData;
    
    const query = `
      UPDATE classes 
      SET name = $1, department = $2, student_count = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, department, student_count, id]);
    return result.rows[0];
  },

  // Delete class
  deleteClass: async (id) => {
    const query = 'DELETE FROM classes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
