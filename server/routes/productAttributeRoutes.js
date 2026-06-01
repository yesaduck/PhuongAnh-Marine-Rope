import express from 'express'
import {
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute
} from '../controllers/productAttributeController.js'
import { verifyToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// Lấy tất cả thuộc tính
router.get('/', getAttributes)

// Thêm thuộc tính
router.post(
  '/',
  verifyToken,
  requireRole(['admin', 'staff']),
  createAttribute
)

// Cập nhật thuộc tính
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin', 'staff']),
  updateAttribute
)

// Xóa thuộc tính
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin', 'staff']),
  deleteAttribute
)

export default router