import express from 'express';
import { userControllers } from '../controllers/userControllers.js';

const router = express.Router();

// Authentication routes
router.post('/login', userControllers.login);
router.post('/register', userControllers.register);

// User CRUD routes
router.get('/', userControllers.getAllUsers);
router.get('/:id', userControllers.getUserById);
router.post('/', userControllers.createUser);
router.put('/:id', userControllers.updateUser);
router.delete('/:id', userControllers.deleteUser);

export default router;