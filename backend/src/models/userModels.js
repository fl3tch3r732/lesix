import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const userModels = {
  // Get all users
  getAllUsers: async () => {
    const query = 'SELECT id, name, email, role, department, avatar, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Get user by ID
  getUserById: async (id) => {
    const query = 'SELECT id, name, email, role, department, avatar, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Create new user
  createUser: async (userData) => {
    const { name, email, password, role, department, avatar } = userData;
    const allowedDepartments = ['GI', 'ASR', 'GL', 'GRT'];
    if (!allowedDepartments.includes(department)) {
      throw new Error('Invalid department. Allowed values: GI, ASR, GL, GRT');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, password, role, department, avatar)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, department, avatar, created_at
    `;
    
    const result = await pool.query(query, [name, email, hashedPassword, role, department, avatar]);
    return result.rows[0];
  },

  // Update user
  updateUser: async (id, userData) => {
    const { name, email, role, department, avatar } = userData;
    const allowedDepartments = ['GI', 'ASR', 'GL', 'GRT'];
    if (!allowedDepartments.includes(department)) {
      throw new Error('Invalid department. Allowed values: GI, ASR, GL, GRT');
    }
    
    const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, department = $4, avatar = $5
      WHERE id = $6
      RETURNING id, name, email, role, department, avatar, created_at
    `;
    
    const result = await pool.query(query, [name, email, role, department, avatar, id]);
    return result.rows[0];
  },

  // Delete user
  deleteUser: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Verify password
  verifyPassword: async (email, password) => {
    const user = await userModels.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
};
