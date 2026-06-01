import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  RefreshCw,
  Search,
  Eye,
  ChevronDown,
  Phone,
  MapPin,
  CalendarDays,
  Wallet,
  Package
} from 'lucide-react'
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

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

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

  const summary = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((item) => item.status === 'pending').length,
      shipping: orders.filter((item) => item.status === 'shipping').length,
      completed: orders.filter((item) => item.status === 'completed').length,
      cancelled: orders.filter((item) => item.status === 'cancelled').length
    }
  }, [orders])

  async function loadOrders() {
    try {
      setLoading(true)
      const data = await fetchOrders()
      setOrders(Array.isArray(data) ? data : data.items || [])
    } catch {
      toast.error('Không thể tải đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId, status) {
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
          <span className="orders-eyebrow">Order Management</span>
          <h1>Quản lý đơn hàng</h1>
          <p>Theo dõi đơn hàng, kiểm tra chi tiết và cập nhật trạng thái giao hàng.</p>
        </div>

        <button type="button" className="refresh-btn" onClick={loadOrders}>
          <RefreshCw size={17} />
          Làm mới
        </button>
      </section>

      <section className="orders-summary-grid">
        <SummaryCard title="Tổng đơn" value={summary.all} tone="blue" />
        <SummaryCard title="Chờ xử lý" value={summary.pending} tone="amber" />
        <SummaryCard title="Đang giao" value={summary.shipping} tone="purple" />
        <SummaryCard title="Hoàn thành" value={summary.completed} tone="green" />
        <SummaryCard title="Đã hủy" value={summary.cancelled} tone="red" />
      </section>

      <section className="orders-card">
        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên khách, số điện thoại..."
            />
          </div>

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

        <div className="orders-count-row">
          <span>Đang hiển thị: {filteredOrders.length}</span>
          <span>Tổng đơn: {orders.length}</span>
        </div>

        <div className="orders-list">
          {filteredOrders.map((order) => {
            const isOpen = expandedId === order.id

            return (
              <article key={order.id} className="order-item">
                <div className="order-main">
                  <div>
                    <h2>Đơn hàng #{order.id}</h2>
                    <p>{order.customer_name || 'Khách hàng'}</p>
                  </div>

                  <span className={`status-badge ${order.status}`}>
                    {statusMap[order.status] || order.status}
                  </span>
                </div>

                <div className="order-info-grid">
                  <InfoCard icon={<Phone />} title="Số điện thoại" value={order.phone || 'Chưa có'} />
                  <InfoCard icon={<Wallet />} title="Tổng tiền" value={formatMoney(order.total_price)} />
                  <InfoCard
                    icon={<CalendarDays />}
                    title="Ngày đặt"
                    value={
                      order.created_at
                        ? new Date(order.created_at).toLocaleDateString('vi-VN')
                        : 'Không rõ'
                    }
                  />
                  <InfoCard icon={<Package />} title="Số sản phẩm" value={`${order.items?.length || 0} món`} />
                </div>

                <div className="order-address">
                  <MapPin size={17} />
                  <span>{order.address || 'Chưa có địa chỉ giao hàng'}</span>
                </div>

                <div className="order-actions-row">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="detail-toggle"
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                  >
                    <Eye size={17} />
                    {isOpen ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    <ChevronDown size={17} className={isOpen ? 'rotate' : ''} />
                  </button>
                </div>

                {isOpen && (
                  <div className="order-detail">
                    <h3>Chi tiết sản phẩm</h3>

                    <ul>
                      {(order.items || []).map((item) => (
                        <li key={item.id || item.product_id}>
                          <div>
                            <strong>
                              {item.product_name || `Sản phẩm #${item.product_id}`}
                            </strong>
                            <span>Số lượng: {item.quantity}</span>
                          </div>

                          <b>{formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}</b>
                        </li>
                      ))}
                    </ul>

                    {order.note && (
                      <div className="order-note">
                        <strong>Ghi chú:</strong>
                        <p>{order.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}

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

function SummaryCard({ title, value, tone }) {
  return (
    <article className={`orders-summary-card ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  )
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="order-info-card">
      {icon}
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}