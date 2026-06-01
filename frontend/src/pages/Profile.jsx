import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, logout } from '../services/authService'
import { fetchMyOrders } from '../services/orderService'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
    loadOrders()
  }, [])

  async function loadProfile() {
    const data = await getProfile()
    setUser(data)
    setFormData(data)
  }

  async function loadOrders() {
    try {
      const data = await fetchMyOrders()
      setOrders(Array.isArray(data) ? data.slice(0, 3) : [])
    } catch {
      setOrders([])
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const updated = await updateProfile(formData)
      setUser(updated)
      setEditing(false)
      setMessage('Cập nhật thông tin thành công.')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Cập nhật thất bại.')
    }
  }

  function handleLogout() {
    logout()
    window.location.href = '/'
  }

  if (!user) {
    return <div className="profile-loading">Đang tải thông tin...</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <button type="button" className="profile-back-btn" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>

        <div className="profile-layout">
          <section className="profile-card">
            <div className="profile-header">
              <div>
                <span className="profile-badge">Tài khoản</span>
                <h1>Thông tin cá nhân</h1>
                <p>Quản lý thông tin liên hệ và địa chỉ giao hàng.</p>
              </div>

              <button onClick={handleLogout} className="profile-logout-btn">
                Đăng xuất
              </button>
            </div>

            {message && <div className="profile-message">{message}</div>}

            {!editing ? (
              <div className="profile-info">
                <div className="profile-info-grid">
                  <Info label="Họ tên" value={user.full_name} />
                  <Info label="Email" value={user.email} />
                  <Info label="Số điện thoại" value={user.phone || 'Chưa cập nhật'} />
                  <Info label="Vai trò" value={user.role} />
                </div>

                <Info label="Địa chỉ" value={user.address || 'Chưa cập nhật'} />

                <button onClick={() => setEditing(true)} className="profile-primary-btn">
                  Chỉnh sửa thông tin
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-form-grid">
                  <label>
                    Họ tên
                    <input
                      required
                      value={formData.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label>
                    Số điện thoại
                    <input
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </label>
                </div>

                <label>
                  Địa chỉ
                  <textarea
                    rows="3"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </label>

                <div className="profile-form-actions">
                  <button type="submit" className="profile-primary-btn">
                    Lưu thay đổi
                  </button>

                  <button type="button" onClick={() => setEditing(false)} className="profile-secondary-btn">
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="profile-card">
            <div className="profile-orders-header">
              <div>
                <span className="profile-badge">Đơn hàng</span>
                <h2>Sản phẩm đã đặt</h2>
                <p>Các đơn hàng gần đây của bạn.</p>
              </div>

              <Link to="/my-orders" className="profile-primary-link">
                Xem tất cả
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="profile-empty-orders">
                <p>Bạn chưa có đơn hàng nào.</p>
                <Link to="/products">Mua sản phẩm</Link>
              </div>
            ) : (
              <div className="profile-order-list">
                {orders.map((order) => (
                  <article key={order.id} className="profile-order-item">
                    <div className="profile-order-top">
                      <strong>Đơn #{order.id}</strong>
                      <span>{Number(order.total_price || 0).toLocaleString('vi-VN')} đ</span>
                    </div>

                    <ul>
                      {(order.items || []).slice(0, 2).map((item, index) => (
                        <li key={index}>
                          {item.product_name || `Sản phẩm #${item.product_id}`} x {item.quantity}
                        </li>
                      ))}
                    </ul>

                    <Link to="/my-orders">Xem chi tiết / Đặt lại</Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="profile-info-box">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}