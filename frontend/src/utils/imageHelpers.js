export const getImageUrl = (image) => {
  const API_URL = import.meta.env.VITE_API_URL

  if (!image || typeof image !== 'string') return ''
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('blob:')
  ) {
    return image
  }

  if (image.startsWith('/uploads/')) {
    return API_URL ? `${API_URL}${image}` : image
  }

  const cleanImage = image.replace(/^\/+/, '')
  return API_URL ? `${API_URL}/uploads/${cleanImage}` : `/uploads/${cleanImage}`
}
