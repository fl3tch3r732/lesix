import pool from '../config/db.js';

export const timeSlotModels = {
  // Get all time slots
  getAllTimeSlots: async () => {
    const query = `
      SELECT ts.*, 
             c.name as course_name,
             u.name as teacher_name,
             cl.name as classroom_name,
             cs.name as class_name
      FROM time_slots ts
      LEFT JOIN courses c ON ts.course_id = c.id
      LEFT JOIN users u ON ts.teacher_id = u.id
      LEFT JOIN classrooms cl ON ts.classroom_id = cl.id
      LEFT JOIN classes cs ON ts.class_id = cs.id
      ORDER BY ts.start_time ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get time slot by ID
  getTimeSlotById: async (id) => {
    const query = `
      SELECT ts.*, 
             c.name as course_name,
             u.name as teacher_name,
             cl.name as classroom_name,
             cs.name as class_name
      FROM time_slots ts
      LEFT JOIN courses c ON ts.course_id = c.id
      LEFT JOIN users u ON ts.teacher_id = u.id
      LEFT JOIN classrooms cl ON ts.classroom_id = cl.id
      LEFT JOIN classes cs ON ts.class_id = cs.id
      WHERE ts.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new time slot
  createTimeSlot: async (timeSlotData) => {
    const { title, startTime, endTime, classroomId, teacherId, courseId, classId, color } = timeSlotData;
    
    const query = `
      INSERT INTO time_slots (title, start_time, end_time, classroom_id, teacher_id, course_id, class_id, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, startTime, endTime, classroomId, teacherId, courseId, classId, color]);
    return result.rows[0];
  },

  // Update time slot
  updateTimeSlot: async (id, timeSlotData) => {
    const { title, startTime, endTime, classroomId, teacherId, courseId, classId, color } = timeSlotData;
    
    const query = `
      UPDATE time_slots 
      SET title = $1, start_time = $2, end_time = $3, classroom_id = $4, teacher_id = $5, course_id = $6, class_id = $7, color = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, startTime, endTime, classroomId, teacherId, courseId, classId, color, id]);
    return result.rows[0];
  },

  // Delete time slot
  deleteTimeSlot: async (id) => {
    const query = 'DELETE FROM time_slots WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
,
  // Confirm a time slot by teacher
  confirmTimeSlot: async (id, teacherId) => {
    const query = `
      UPDATE time_slots
      SET teacher_confirmed = TRUE, confirmed_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND teacher_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, teacherId]);
    return result.rows[0];
  }
}; 