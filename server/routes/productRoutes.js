import express from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { verifyToken, requireRole } from '../middleware/authMiddleware.js'
<<<<<<< HEAD

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', verifyToken, requireRole(['admin']), createProduct)
router.put('/:id', verifyToken, requireRole(['admin']), updateProduct)
router.delete('/:id', verifyToken, requireRole(['admin']), deleteProduct)

export default router
=======
import multer from 'multer'
import path from 'path'

const router = express.Router()

// Cấu hình Multer để hỗ trợ upload ảnh khi thêm/sửa thủ công
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({ storage })

// Các route công khai
router.get('/', getProducts)
router.get('/:id', getProduct)

// Các route bảo mật (Chỉ Admin)
// Sử dụng upload.array('images') nhưng cho phép để trống (.any() hoặc xử lý trong controller)
router.post('/', verifyToken, requireRole(['admin', 'staff']), upload.array('images', 5), createProduct)
router.put('/:id', verifyToken, requireRole(['admin', 'staff']), upload.array('images', 5), updateProduct)
router.delete('/:id', verifyToken, requireRole(['admin']), deleteProduct)

export default router
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
