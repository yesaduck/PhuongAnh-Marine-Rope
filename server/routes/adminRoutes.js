import express from 'express'
import { login, getAllUsers, updateUserRole } from '../controllers/adminController.js'
import { verifyToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.get('/users', verifyToken, requireRole(['admin']), getAllUsers)
router.patch('/users/:id/role', verifyToken, requireRole(['admin']), updateUserRole)

export default router
