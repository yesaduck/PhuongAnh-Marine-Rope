<<<<<<< HEAD
import express from 'express'
import { login } from '../controllers/adminController.js'

const router = express.Router()

router.post('/login', login)

export default router
=======
import express from 'express';
import { login, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Đăng nhập admin
router.post('/login', login);

// Các route quản trị (Yêu cầu phải là Admin mới được dùng)
router.get('/users', verifyToken, requireRole(['admin']), getAllUsers);
router.patch('/users/:id/role', verifyToken, requireRole(['admin']), updateUserRole);

export default router;
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
