import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { fetchMyOrders } from '../services/orderService'
import { addItem, clearCart } from '../services/cartService'
import './MyOrders.css'

const statusText = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)
      const data = await fetchMyOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Không thể tải lịch sử đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  function normalizeImages(images) {
    if (!images) return []

    if (Array.isArray(images)) return images

    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed : [images]
      } catch {
        return images.split(',').map((i) => i.trim()).filter(Boolean)
      }
    }

    return []
  }

  function handleReorder(order) {
    try {
      const items = order.items || []

      if (!items.length) {
        toast.error('Đơn hàng này không có sản phẩm để đặt lại.')
        return
      }

      clearCart()

      items.forEach((item) => {
        const productId = item.product_id || item.productId

        if (!productId) return

        const images = normalizeImages(item.product_images || item.image)

        const product = {
          id: productId,
          name: item.product_name || item.name || `Sản phẩm #${productId}`,
          images
        }

        const selectedVariant = {
          id:
            item.variant_id ||
            item.variantId ||
            item.product_variant_id ||
            `${productId}_${item.size || 'default'}_${item.material || 'default'}`,
          category: item.category || '',
          size: item.size || '',
          material: item.material || '',
          weight_kg: item.weight_kg || 0,
          unit: item.unit || 'cuộn',
          price: Number(item.price || 0),
          stock: item.stock || 9999,
          image: images[0] || ''
        }

        addItem(product, selectedVariant, Number(item.quantity || 1))
      })

      toast.success('Đã thêm lại sản phẩm vào giỏ hàng.')

      setTimeout(() => {
        navigate('/cart')
      }, 700)
    } catch (error) {
      toast.error(error.message || 'Không thể đặt lại đơn này.')
    }
  }

  if (loading) {
    return <div className="my-orders-loading">Đang tải đơn hàng...</div>
  }

  return (
    <div className="my-orders-page">
      <Toaster position="top-right" />

      <div className="my-orders-container">
        <button type="button" className="my-orders-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <section className="my-orders-card">
          <div className="my-orders-header">
            <div>
              <span className="my-orders-badge">Lịch sử</span>
              <h1>Đơn hàng của tôi</h1>
              <p>Theo dõi trạng thái giao hàng và đặt lại đơn cũ nhanh chóng.</p>
            </div>

            <button type="button" className="my-orders-refresh" onClick={loadOrders}>
              Làm mới
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="my-orders-empty">
              <h2>Bạn chưa có đơn hàng nào</h2>
              <p>Hãy chọn sản phẩm phù hợp để bắt đầu đặt hàng.</p>
              <button onClick={() => navigate('/products')}>Mua sản phẩm</button>
            </div>
          ) : (
            <div className="my-orders-list">
              {orders.map((order) => (
                <article key={order.id} className="my-order-item">
                  <div className="my-order-top">
                    <div>
                      <h2>Đơn hàng #{order.id}</h2>
                      <p>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('vi-VN')
                          : 'Không rõ ngày'}
                      </p>
                    </div>

                    <div className="my-order-summary">
                      <span className={`order-status ${order.status}`}>
                        {statusText[order.status] || order.status}
                      </span>

                      <strong>
                        {Number(order.total_price || 0).toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  </div>

                  <div className="my-order-products">
                    <h3>Sản phẩm đã đặt</h3>

                    <ul>
                      {(order.items || []).map((item, idx) => (
                        <li key={idx}>
                          <span>
                            {item.product_name || `Sản phẩm #${item.product_id}`}
                          </span>

                          <strong>
                            {item.quantity} x{' '}
                            {Number(item.price || 0).toLocaleString('vi-VN')} đ
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="my-order-actions">
                    <button type="button" onClick={() => handleReorder(order)}>
                      Đặt lại đơn này
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}