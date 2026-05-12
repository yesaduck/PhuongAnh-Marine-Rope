<<<<<<< HEAD
import express from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)

export default router
=======
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
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
