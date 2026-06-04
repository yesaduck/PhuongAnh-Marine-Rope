import './Gallery.css'
import { getImageUrl } from '../utils/imageHelpers'

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

export default function Gallery({ images }) {
  const list = normalizeImages(images)

  if (!list.length) {
    return (
      <img
        src="https://"/home.PNG"/760x460?text=No+Image"
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
              'https://"/home.PNG"/400x300?text=No+Image'
          }}
        />
      ))}
    </div>
  )
}