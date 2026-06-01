import { Link } from 'react-router-dom'
import './ProductCard.css'

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
  if (!src) return 'https://via.placeholder.com/400x300?text=No+Image'
  if (src.startsWith('http')) return src
  if (src.startsWith('blob:')) return src
  return `${API_ORIGIN}${src}`
}

export default function ProductCard({ product }) {
  const images = normalizeImages(product.images)
  const imageUrl = getImageUrl(images[0])
  const priceLabel =
    product.price > 0 ? (
      <p className="product-card-price">
        {Number(product.price || 0).toLocaleString('vi-VN')} đ
      </p>
    ) : (
      <p className="product-card-price">Liên hệ</p>
    )

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
      </Link>

      <div className="product-card-body">
        <div>
          <p className="product-card-category">
            {product.category || 'Khác'}
          </p>

          <h3>{product.name}</h3>
        </div>

        <p>Kích thước: {product.size || 'Đang cập nhật'}</p>
        <p>Chất liệu: {product.material || 'Đang cập nhật'}</p>

        <div className="product-card-footer">
          {priceLabel}

          <Link to={`/products/${product.id}`}>
            Mua ngay
          </Link>
        </div>
      </div>
    </article>
  )
}