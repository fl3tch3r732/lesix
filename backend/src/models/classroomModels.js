import pool from '../config/db.js';

export const classroomModels = {
  // Get all classrooms
  getAllClassrooms: async () => {
    const query = 'SELECT * FROM classrooms ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Get classroom by ID
  getClassroomById: async (id) => {
    const query = 'SELECT * FROM classrooms WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new classroom
  createClassroom: async (classroomData) => {
    const { name, capacity, building, floor, hasProjector, hasComputers, isLab } = classroomData;
    
    const query = `
      INSERT INTO classrooms (name, capacity, building, floor, has_projector, has_computers, is_lab)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, capacity, building, floor, hasProjector, hasComputers, isLab]);
    return result.rows[0];
  },

  // Update classroom
  updateClassroom: async (id, classroomData) => {
    const { name, capacity, building, floor, hasProjector, hasComputers, isLab } = classroomData;
    
    const query = `
      UPDATE classrooms 
      SET name = $1, capacity = $2, building = $3, floor = $4, has_projector = $5, has_computers = $6, is_lab = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, capacity, building, floor, hasProjector, hasComputers, isLab, id]);
    return result.rows[0];
  },

  // Delete classroom
  deleteClassroom: async (id) => {
    const query = 'DELETE FROM classrooms WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}; 