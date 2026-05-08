export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file.' })
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ url: imageUrl })
}
