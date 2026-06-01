import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  const { full_name, email, message } = req.body

  if (!full_name?.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập họ tên.' })
  }

  if (!email?.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập email.' })
  }

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập nội dung liên hệ.' })
  }

  console.log('CONTACT MESSAGE:', {
    full_name,
    email,
    message,
    time: new Date().toISOString()
  })

  res.status(201).json({
    success: true,
    message: 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm.'
  })
})

export default router
