import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  socialLogin // Import thêm hàm này
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Route đăng nhập Google (Fix lỗi 404)
router.post('/social-login', socialLogin);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;