import express from 'express'
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js'
import { verifyToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(verifyToken, requireRole(['admin']))

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
