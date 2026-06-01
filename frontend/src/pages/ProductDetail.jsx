import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addItem, clearOldSharedCart } from '../services/cartService'
import { getToken } from '../services/authService'
import Gallery from '../components/Gallery'
import toast, { Toaster } from 'react-hot-toast'
import {
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  Package,
  Ruler,
  Layers,
  Weight,
  ShieldCheck,
  Truck,
  Headphones,
  BadgeDollarSign
} from 'lucide-react'
import './ProductDetail.css'

function normalizeImages(images) {
  if (!images) return []
  if (Array.isArray(images)) return images

  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : [images]
  } catch {
    return [images]
  }
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearOldSharedCart()

    async function loadProduct() {
      try {
        setLoading(true)

        const data = await fetchProductById(id)

        const normalized = {
          ...data,
          images: normalizeImages(data.images),
          variants: Array.isArray(data.variants) ? data.variants : []
        }

        setProduct(normalized)
        setSelectedVariantId(normalized.variants[0]?.id || null)
      } catch {
        toast.error('Không thể tải thông tin sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const selectedVariant = useMemo(() => {
    return product?.variants?.find(
      (item) => String(item.id) === String(selectedVariantId)
    )
  }, [product, selectedVariantId])

  const maxStock = Number(selectedVariant?.stock || 0)

  function handleSelectVariant(variantId) {
    setSelectedVariantId(variantId)
    setQuantity(1)
  }

  function increaseQuantity() {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1)
    }
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  function handleQuantityChange(value) {
    const number = Number(value)

    if (Number.isNaN(number)) {
      setQuantity(1)
      return
    }

    setQuantity(Math.max(1, Math.min(number, maxStock || 1)))
  }

  function handleAddToCart() {
    if (!product || !selectedVariant) {
      toast.error('Vui lòng chọn loại sản phẩm.')
      return
    }

    if (!getToken()) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
      setTimeout(() => navigate('/login'), 700)
      return
    }

    if (maxStock <= 0) {
      toast.error('Loại sản phẩm này đã hết hàng.')
      return
    }

    if (quantity > maxStock) {
      toast.error(`Chỉ còn ${maxStock} cuộn trong kho.`)
      return
    }

    try {
      addItem(product, selectedVariant, quantity)
      toast.success(`Đã thêm ${quantity} cuộn vào giỏ hàng.`)
    } catch (error) {
      toast.error(error.message || 'Không thể thêm vào giỏ hàng.')
    }
  }

  function handleBuyNow() {
    handleAddToCart()
    if (getToken() && selectedVariant && maxStock > 0) {
      setTimeout(() => navigate('/cart'), 500)
    }
  }

  if (loading) {
    return <div className="product-detail-loading">Đang tải thông tin sản phẩm...</div>
  }

  if (!product) {
    return <div className="product-detail-not-found">Sản phẩm không tồn tại!</div>
  }

  return (
    <div className="product-detail-page">
      <Toaster position="top-center" />

      <button className="back-button" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} />
        Quay lại
      </button>

      <div className="product-detail-layout">
        <section className="product-gallery-card">
          <Gallery images={product.images} />
        </section>

        <section className="product-info-card">
          <div className="product-header">
            <span className="product-category">
              {selectedVariant?.category || 'Sản phẩm'}
            </span>

            <h1>{product.name}</h1>

            <p className="product-price">
              {selectedVariant
                ? `${formatMoney(selectedVariant.price)}/cuộn`
                : 'Vui lòng chọn loại sản phẩm'}
            </p>
          </div>

          <div className="variant-section">
            <h3>Chọn loại sản phẩm</h3>

            <div className="variant-options">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={
                    String(selectedVariantId) === String(variant.id)
                      ? 'active'
                      : ''
                  }
                  disabled={Number(variant.stock || 0) <= 0}
                  onClick={() => handleSelectVariant(variant.id)}
                >
                  {variant.category} - {variant.size}m - {variant.material}
                </button>
              ))}
            </div>
          </div>

          <div className="product-meta-list">
            <div className="meta-row">
              <span><Ruler size={18} /> Kích thước</span>
              <strong>{selectedVariant?.size || 'N/A'} m</strong>
            </div>

            <div className="meta-row">
              <span><Layers size={18} /> Chất liệu</span>
              <strong>{selectedVariant?.material || 'N/A'}</strong>
            </div>

            <div className="meta-row">
              <span><Weight size={18} /> Trọng lượng</span>
              <strong>{selectedVariant?.weight_kg || 0} kg/cuộn</strong>
            </div>

            <div className="meta-row">
              <span><Package size={18} /> Tồn kho</span>
              <strong className={maxStock > 0 ? 'stock-in' : 'stock-out'}>
                {maxStock > 0 ? `Còn ${maxStock} cuộn` : 'Hết hàng'}
              </strong>
            </div>
          </div>

          <div className="product-description">
            <h2>Mô tả sản phẩm</h2>
            <p>{product.description || 'Thông tin đang được cập nhật...'}</p>
          </div>

          <div className="quantity-section">
            <span>Số lượng cuộn</span>

            <div className="quantity-box">
              <button type="button" onClick={decreaseQuantity}>
                <Minus size={16} />
              </button>

              <input
                type="number"
                min="1"
                max={maxStock || 1}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />

              <button type="button" onClick={increaseQuantity}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="product-action-row">
            <button
              type="button"
              className="add-cart-button"
              disabled={!selectedVariant || maxStock <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>

            <button
              type="button"
              className="buy-now-button"
              disabled={!selectedVariant || maxStock <= 0}
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
          </div>
        </section>
      </div>

      <section className="product-benefits">
        <div>
          <ShieldCheck size={28} />
          <strong>Sản phẩm chất lượng</strong>
          <span>Cam kết dây bền, đạt chuẩn</span>
        </div>

        <div>
          <BadgeDollarSign size={28} />
          <strong>Giá cả cạnh tranh</strong>
          <span>Giá tốt từ xưởng sản xuất</span>
        </div>

        <div>
          <Truck size={28} />
          <strong>Giao hàng toàn quốc</strong>
          <span>Giao nhanh, đúng hẹn</span>
        </div>

        <div>
          <Headphones size={28} />
          <strong>Hỗ trợ 24/7</strong>
          <span>Tư vấn tận tâm, nhanh chóng</span>
        </div>
      </section>
    </div>
  )
}