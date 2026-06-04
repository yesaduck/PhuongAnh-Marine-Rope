import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
  User,
  ShieldCheck,
  PackageCheck
} from 'lucide-react'
import { createOrder } from '../services/orderService'
import { getCart, clearCart } from '../services/cartService'
import { getProfile } from '../services/authService'
import { getImageUrl } from '../utils/imageHelpers'
import './Checkout.css'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="400"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="Arial" font-size="28">No Image</text></svg>'

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

function getItemImageUrl(item) {
  const images = normalizeImages(item.images)
  const src = images[0] || item.image || item.imageUrl

  if (!src) return FALLBACK_IMAGE
  return getImageUrl(src)
}

export default function Checkout() {
  const navigate = useNavigate()
  const cart = getCart()

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    note: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const user = await getProfile()

        setForm((prev) => ({
          ...prev,
          customer_name: user.full_name || '',
          phone: user.phone || '',
          address: user.address || ''
        }))
      } catch {
        // Bỏ qua nếu không lấy được thông tin
      }
    }

    loadUserInfo()
  }, [])

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }, [cart])

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    )
  }, [cart])

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập họ tên.'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại.'
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ.'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (cart.length === 0) {
      toast.error('Giỏ hàng đang trống.')
      navigate('/products')
      return
    }

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin giao hàng.')
      return
    }

    try {
      setLoading(true)

      const payload = {
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
        total_price: total,
        items: cart.map((item) => ({
          product_id: item.product_id || item.productId || item.id,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0)
        }))
      }

      console.log('Order payload:', payload)

      await createOrder(payload)

      clearCart()
      setSuccessModal(true)
  } catch (err) {
  console.log('STATUS:', err.response?.status)
  console.log('DATA:', JSON.stringify(err.response?.data, null, 2))
  console.log('FULL ERROR:', err)

  toast.error(
    err.response?.data?.sqlMessage ||
    err.response?.data?.error ||
    'Có lỗi trong quá trình gửi đơn hàng.'
  )
} finally {
  setLoading(false)
}
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <ShoppingBag size={48} />
          </div>

          <h1>Không có sản phẩm để thanh toán</h1>

          <p>
            Giỏ hàng của bạn đang trống. Hãy chọn sản phẩm trước khi đặt hàng.
          </p>

          <Link to="/products">Xem sản phẩm</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Toaster position="top-right" />

      <section className="checkout-hero">
        <div>
          <span className="checkout-badge">
            <ClipboardList size={16} />
            Thanh toán
          </span>

          <h1>Hoàn tất đơn hàng</h1>

          <p>
            Kiểm tra sản phẩm và nhập thông tin giao hàng chính xác để chúng tôi
            liên hệ nhanh nhất.
          </p>
        </div>

        <Link to="/cart" className="checkout-back-link">
          <ArrowLeft size={17} />
          Quay lại giỏ hàng
        </Link>
      </section>

      <section className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form-card" noValidate>
          <div className="checkout-card-header">
            <h2>Thông tin giao hàng</h2>
            <p>Thông tin này dùng để xác nhận và giao đơn hàng.</p>
          </div>

          <div className="checkout-form-grid">
            <InputField
              label="Họ tên"
              icon={<User size={17} />}
              placeholder="Nguyễn Văn A"
              value={form.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              error={errors.customer_name}
            />

            <InputField
              label="Số điện thoại"
              icon={<Phone size={17} />}
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
            />

            <InputField
              className="full"
              label="Địa chỉ giao hàng"
              icon={<MapPin size={17} />}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={errors.address}
            />

            <label className="checkout-field full">
              <span>Ghi chú</span>

              <div className="checkout-textarea-wrap">
                <MessageSquare size={17} />
                <textarea
                  rows="4"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                Đang gửi đơn hàng...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Xác nhận đặt hàng
              </>
            )}
          </button>
        </form>

        <aside className="checkout-summary-card">
          <div className="checkout-card-header">
            <h2>Tóm tắt đơn hàng</h2>
            <p>{totalItems} sản phẩm trong đơn hàng</p>
          </div>

          <div className="checkout-items">
            {cart.map((item) => (
              <article key={item.productId || item.id} className="checkout-item">
                <img
                  src={getItemImageUrl(item)}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />

                <div>
                  <strong>{item.name}</strong>
                  <span>
                    SL: {item.quantity} ·{' '}
                    {Number(item.price || 0).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="checkout-total-box">
            <div>
              <span>Tạm tính</span>
              <strong>{total.toLocaleString('vi-VN')} đ</strong>
            </div>

            <div>
              <span>Tổng tiền</span>
              <strong className="total-price">
                {total.toLocaleString('vi-VN')} đ
              </strong>
            </div>
          </div>

          <div className="checkout-contact-actions">
            <a href="tel:0901234567">
              <Phone size={17} />
              Gọi nhanh
            </a>

            <a
              href="https://zalo.me/0901234567"
              target="_blank"
              rel="noreferrer"
            >
              Chat Zalo
            </a>
          </div>

          <div className="checkout-benefits">
            <div>
              <ShieldCheck size={17} />
              <span>Thông tin đặt hàng được bảo mật.</span>
            </div>

            <div>
              <PackageCheck size={17} />
              <span>Nhân viên sẽ liên hệ xác nhận trước khi giao.</span>
            </div>
          </div>
        </aside>
      </section>

      {successModal && (
        <div className="checkout-success-overlay">
          <div className="checkout-success-modal">
            <div className="checkout-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <h3>Đặt hàng thành công</h3>

            <p>
              Cảm ơn bạn đã đặt hàng tại Phương Anh Rope.
              Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
            </p>

            <div className="checkout-success-actions">
              <button
                type="button"
                onClick={() => navigate('/my-orders', { replace: true })}
              >
                Xem đơn hàng
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => navigate('/products', { replace: true })}
              >
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InputField({ label, icon, error, className = '', ...props }) {
  return (
    <label className={`checkout-field ${className}`}>
      <span>{label}</span>

      <div className={`checkout-input-wrap ${error ? 'has-error' : ''}`}>
        {icon}
        <input {...props} />
      </div>

      {error && <p className="checkout-error">{error}</p>}
    </label>
  )
}