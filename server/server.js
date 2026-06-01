import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import productAttributeRoutes from './routes/productAttributeRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '.env')
})

const app = express()
const PORT = Number(process.env.PORT) || 5002
const uploadsDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Đã tạo thư mục uploads/')
}

app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

app.use('/uploads', express.static(uploadsDir))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/product-attributes', productAttributeRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    time: new Date().toISOString(),
    port: PORT
  })
})

app.get('/', (req, res) => {
  res.send('Phương Anh Rope API Server is running.')
})

app.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint không tồn tại.'
  })
})

app.use((err, req, res, next) => {
  console.error('Global Error:', err)

  res.status(err.status || 500).json({
    error: err.message || 'Lỗi máy chủ nội bộ.'
  })
})

const server = app.listen(PORT, () => {
  console.log(`Server chạy tại: http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} đang được sử dụng.`)
    console.error(`Chạy: netstat -ano | findstr :${PORT}`)
    console.error('Sau đó: taskkill /PID <PID> /F')
  } else {
    console.error('Server Error:', error)
  }

  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('\nĐang tắt server...')
  server.close(() => {
    console.log('Server đã dừng.')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\nNhận SIGTERM. Đang tắt server...')
  server.close(() => {
    console.log('Server đã dừng.')
    process.exit(0)
  })
})