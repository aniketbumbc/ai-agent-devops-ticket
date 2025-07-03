import express from 'express';

import {
  signUp,
  login,
  updateUser,
  logout,
  getUsers,
} from '../controllers/user.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/update-user', authenticate, updateUser);
router.post('/users', authenticate, getUsers);

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

export default router;
