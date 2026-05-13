import express from 'express'
import {
  register,
  login,
  socialLogin,
  getProfile,
  updateProfile
} from '../controllers/authController.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/social-login', socialLogin)

router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)

export default router