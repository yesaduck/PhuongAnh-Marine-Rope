import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { fetchOrders, updateOrderStatus } from '../services/orderService'
import './AdminOrders.css'

const orderStatuses = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

const statusMap = Object.fromEntries(orderStatuses.map((item) => [item.value, item.label]))

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return orders.filter((order) => {
      const matchSearch =
        !keyword ||
        String(order.id).includes(keyword) ||
        order.customer_name?.toLowerCase().includes(keyword) ||
        order.phone?.includes(keyword)

      const matchStatus = !statusFilter || order.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Không thể tải đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      )

      toast.success('Cập nhật trạng thái thành công.')
    } catch {
      toast.error('Cập nhật trạng thái thất bại.')
    }
  }

  return (
    <div className="admin-orders-page">
      <Toaster position="top-right" />

      <section className="orders-hero">
        <div>
          <h1>Quản lý đơn hàng</h1>
          <p>Xem đơn hàng, lọc trạng thái và cập nhật tiến độ giao hàng.</p>
        </div>

        <button type="button" className="refresh-btn" onClick={loadOrders}>
          Làm mới
        </button>
      </section>

      <section className="orders-card">
        <div className="orders-toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="orders-summary">
          <span>Tổng đơn: {orders.length}</span>
          <span>Đang hiển thị: {filteredOrders.length}</span>
        </div>

        <div className="orders-list">
          {filteredOrders.map((order) => (
            <article key={order.id} className="order-item">
              <div className="order-main">
                <div>
                  <h2>Đơn hàng #{order.id}</h2>
                  <p>
                    {order.customer_name || 'Khách hàng'} • {order.phone || 'Chưa có SĐT'}
                  </p>
                </div>

                <span className={`status-badge ${order.status}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </div>

              <div className="order-info-grid">
                <div>
                  <span>Tổng tiền</span>
                  <strong>{Number(order.total_price || 0).toLocaleString('vi-VN')} đ</strong>
                </div>

                <div>
                  <span>Số sản phẩm</span>
                  <strong>{order.items?.length || 0}</strong>
                </div>

                <div>
                  <span>Ngày đặt</span>
                  <strong>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('vi-VN')
                      : 'Không rõ'}
                  </strong>
                </div>
              </div>

              <div className="status-actions">
                {orderStatuses.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    className={order.status === status.value ? 'active' : ''}
                    onClick={() => handleStatusChange(order.id, status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="detail-toggle"
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              >
                {expandedId === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
              </button>

              {expandedId === order.id && (
                <div className="order-detail">
                  <h3>Chi tiết đơn hàng</h3>

                  <ul>
                    {(order.items || []).map((item) => (
                      <li key={item.id || item.product_id}>
                        <span>
                          {item.product_name || `Sản phẩm #${item.product_id}`}
                        </span>

                        <strong>
                          {item.quantity} x {Number(item.price || 0).toLocaleString('vi-VN')} đ
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}

          {!loading && filteredOrders.length === 0 && (
            <div className="empty-orders">
              Không tìm thấy đơn hàng phù hợp.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}