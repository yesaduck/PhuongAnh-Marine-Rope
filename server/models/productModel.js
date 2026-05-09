import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (Ai cũng xem được)
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes (Chỉ Admin mới được thay đổi sản phẩm)
router.post('/', verifyToken, requireRole(['admin']), createProduct);
router.put('/:id', verifyToken, requireRole(['admin']), updateProduct);
router.delete('/:id', verifyToken, requireRole(['admin']), deleteProduct);

export default router;