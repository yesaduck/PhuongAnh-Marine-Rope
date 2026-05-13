import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addItem } from '../services/cartService'
import Gallery from '../components/Gallery'
import toast, { Toaster } from 'react-hot-toast'
import {
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  Package,
  Ruler,
  Layers
} from 'lucide-react'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await fetchProductById(id)

        if (data && typeof data.images === 'string') {
          try {
            data.images = JSON.parse(data.images)
          } catch {
            data.images = [data.images]
          }
        }

        if (!Array.isArray(data.images)) {
          data.images = []
        }

        setProduct(data)
      } catch (error) {
        toast.error('Không thể tải thông tin sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleQuantityChange = (value) => {
    const num = Number(value)

    if (isNaN(num)) {
      setQuantity(1)
      return
    }

    if (!product) {
      setQuantity(Math.max(1, num))
      return
    }

    setQuantity(Math.max(1, Math.min(num, product.stock || 1)))
  }

  const handleAddToCart = () => {
    if (!product) return

    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng!')
      return
    }

    if (quantity > product.stock) {
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
      return
    }

    addItem(product, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        Đang tải thông tin sản phẩm...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-not-found">
        Sản phẩm không tồn tại!
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <Toaster position="top-center" />

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={18} />
        Quay lại
      </button>

      <div className="product-detail-layout">
        {/* Gallery */}
        <div className="product-gallery-card">
          <Gallery images={product.images} />
        </div>

        {/* Info */}
        <div className="product-info-card">
          <div className="product-header">
            <span className="product-category">
              {product.category || 'Sản phẩm'}
            </span>

            <h1>{product.name}</h1>

            <p className="product-price">
              {product.price > 0
                ? `${Number(product.price).toLocaleString('vi-VN')} đ`
                : 'Liên hệ'}
            </p>
          </div>

          <div className="product-meta-grid">
            <div className="meta-item">
              <Ruler size={18} />
              <div>
                <span>Kích thước</span>
                <strong>{product.size || 'N/A'}</strong>
              </div>
            </div>

            <div className="meta-item">
              <Layers size={18} />
              <div>
                <span>Chất liệu</span>
                <strong>{product.material || 'N/A'}</strong>
              </div>
            </div>

            <div className="meta-item">
              <Package size={18} />
              <div>
                <span>Tồn kho</span>
                <strong
                  className={
                    product.stock > 0
                      ? 'stock-in'
                      : 'stock-out'
                  }
                >
                  {product.stock > 0
                    ? `Còn ${product.stock}`
                    : 'Hết hàng'}
                </strong>
              </div>
            </div>
          </div>

          <div className="product-description">
            <h2>Mô tả sản phẩm</h2>
            <p>
              {product.description ||
                'Thông tin đang được cập nhật...'}
            </p>
          </div>

          <div className="quantity-section">
            <span>Số lượng</span>

            <div className="quantity-box">
              <button
                type="button"
                onClick={decreaseQuantity}
              >
                <Minus size={16} />
              </button>

              <input
                type="number"
                min="1"
                max={product.stock || 1}
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(e.target.value)
                }
              />

              <button
                type="button"
                onClick={increaseQuantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            className="add-cart-button"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            {product.stock > 0
              ? 'Thêm vào giỏ hàng'
              : 'Tạm hết hàng'}
          </button>
        </div>
      </div>
    </div>
  )
}