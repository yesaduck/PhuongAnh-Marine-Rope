export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file.' })
  }

  const BASE_URL = process.env.BASE_URL || 'http://localhost:5002'
  const imagePath = `/uploads/${req.file.filename}`

  res.json({
    url: imagePath,
    image_url: `${BASE_URL}${imagePath}`
  })
}
