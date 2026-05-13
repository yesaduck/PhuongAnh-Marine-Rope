import './Gallery.css'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:5002'

function normalizeImages(images) {
  if (!images) return []

  if (Array.isArray(images)) return images

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function getImageUrl(src) {
  if (!src) return 'https://via.placeholder.com/760x460?text=No+Image'
  if (src.startsWith('http')) return src
  if (src.startsWith('blob:')) return src
  return `${API_ORIGIN}${src}`
}

export default function Gallery({ images }) {
  const list = normalizeImages(images)

  if (!list.length) {
    return (
      <img
        src="https://via.placeholder.com/760x460?text=No+Image"
        alt="No image"
        className="gallery-empty"
      />
    )
  }

  return (
    <div className="gallery-grid">
      {list.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={getImageUrl(src)}
          alt={`Hình ảnh ${index + 1}`}
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
      ))}
    </div>
  )
}