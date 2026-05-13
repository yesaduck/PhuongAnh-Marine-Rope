  import express from 'express'
  import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
  import { verifyToken, requireRole } from '../middleware/authMiddleware.js'
  import multer from 'multer'
  import path from 'path'

  const router = express.Router()

  const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `product-${Date.now()}${path.extname(file.originalname)}`)
    }
  })
  const upload = multer({ storage })

  router.get('/', getProducts)
  router.get('/:id', getProduct)
  router.post('/', verifyToken, requireRole(['admin', 'staff']), upload.array('images', 5), createProduct)
  router.put('/:id', verifyToken, requireRole(['admin', 'staff']), upload.array('images', 5), updateProduct)
  router.delete('/:id', verifyToken, requireRole(['admin']), deleteProduct)

  export default router
