import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImage } from '../controllers/uploadController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

const upload = multer({ storage })
const router = express.Router()

router.post('/', upload.single('image'), uploadImage)

export default router
