import express from 'express'
import { getOrders, createOrder, getMyOrders, updateOrder } from '../controllers/orderController.js'
import { verifyToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', verifyToken, createOrder)
router.get('/my', verifyToken, getMyOrders)
router.get('/', verifyToken, requireRole(['admin', 'staff']), getOrders)
router.put('/:id', verifyToken, requireRole(['admin', 'staff']), updateOrder)

export default router
