import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import {
  Package,
  ShoppingCart,
  Users,
  Wallet,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { fetchProducts } from '../services/productService'
import { fetchOrders } from '../services/orderService'
import { fetchUsers } from '../services/userService'
import './AdminDashboard.css'

const fmtCur = (n) => `${Number(n || 0).toLocaleString('vi-VN')} đ`

const statusLabel = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0
  })

  const [orders, setOrders] = useState([])
  const [revenueChart, setRevenueChart] = useState([])
  const [range, setRange] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [range])

  const maxRevenue = useMemo(() => {
    return Math.max(...revenueChart.map((item) => item.value), 1)
  }, [revenueChart])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 6)
  }, [orders])

  const completionRate = useMemo(() => {
    if (!stats.orders) return 0
    return Math.round((stats.completed / stats.orders) * 100)
  }, [stats])

  async function loadDashboard() {
    try {
      setLoading(true)

      const [productsData, ordersData, usersData] = await Promise.all([
        fetchProducts({ limit: 1000 }),
        fetchOrders(),
        fetchUsers()
      ])

      const products = productsData.items || productsData || []
      const orderList = Array.isArray(ordersData)
        ? ordersData
        : ordersData.items || []
      const users = Array.isArray(usersData)
        ? usersData
        : usersData.items || []

      const completedOrders = orderList.filter(
        (order) => order.status === 'completed'
      )

      const revenue = completedOrders.reduce(
        (sum, order) => sum + Number(order.total_price || 0),
        0
      )

      const chart = Array.from({ length: range }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (range - 1 - index))

        const label = `${date.getDate()}/${date.getMonth() + 1}`

        const value = completedOrders
          .filter((order) => {
            if (!order.created_at) return false
            return new Date(order.created_at).toDateString() === date.toDateString()
          })
          .reduce((sum, order) => sum + Number(order.total_price || 0), 0)

        return { label, value }
      })

      setOrders(orderList)
      setRevenueChart(chart)

      setStats({
        products: products.length,
        orders: orderList.length,
        revenue,
        users: users.length,
        pending: orderList.filter((order) => order.status === 'pending').length,
        confirmed: orderList.filter((order) => order.status === 'confirmed').length,
        shipping: orderList.filter((order) => order.status === 'shipping').length,
        completed: completedOrders.length,
        cancelled: orderList.filter((order) => order.status === 'cancelled').length
      })
    } finally {
      setLoading(false)
    }
  }

  function exportExcel() {
    const summaryRows = [
      { 'Tiêu chí': 'Doanh thu', 'Giá trị': stats.revenue },
      { 'Tiêu chí': 'Tổng đơn', 'Giá trị': stats.orders },
      { 'Tiêu chí': 'Chờ xử lý', 'Giá trị': stats.pending },
      { 'Tiêu chí': 'Đã xác nhận', 'Giá trị': stats.confirmed },
      { 'Tiêu chí': 'Đang giao', 'Giá trị': stats.shipping },
      { 'Tiêu chí': 'Hoàn thành', 'Giá trị': stats.completed },
      { 'Tiêu chí': 'Đã hủy', 'Giá trị': stats.cancelled },
      { 'Tiêu chí': 'Sản phẩm', 'Giá trị': stats.products },
      { 'Tiêu chí': 'Khách hàng', 'Giá trị': stats.users }
    ]

    const chartRows = revenueChart.map((item) => ({
      Ngày: item.label,
      'Doanh thu': item.value
    }))

    const orderRows = orders.map((order) => ({
      'Mã đơn': order.id,
      'Khách hàng': order.customer_name,
      'Số điện thoại': order.phone,
      'Tổng tiền': order.total_price,
      'Trạng thái': statusLabel[order.status] || order.status,
      'Ngày đặt': order.created_at
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'TongQuan')
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(chartRows), 'DoanhThu')
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(orderRows), 'DonHang')
    XLSX.writeFile(workbook, 'bao-cao-phuong-anh-rope.xlsx')
  }

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu thống kê...</div>
  }

  return (
    <div className="admin-dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">Admin Dashboard</span>
          <h1>Tổng quan hệ thống</h1>
          <p>Theo dõi doanh thu, đơn hàng, khách hàng và tình trạng vận hành.</p>
        </div>

        <div className="dashboard-actions">
          <button type="button" className="refresh-report-btn" onClick={loadDashboard}>
            <RefreshCw size={17} />
            Làm mới
          </button>

          <button type="button" className="export-report-btn" onClick={exportExcel}>
            <Download size={17} />
            Xuất báo cáo
          </button>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <KpiCard icon={<Wallet />} title="Doanh thu" value={fmtCur(stats.revenue)} tone="blue" />
        <KpiCard icon={<ShoppingCart />} title="Tổng đơn" value={stats.orders} tone="cyan" />
        <KpiCard icon={<Package />} title="Sản phẩm" value={stats.products} tone="slate" />
        <KpiCard icon={<Users />} title="Khách hàng" value={stats.users} tone="violet" />
      </section>

      <section className="dashboard-status-grid">
        <StatusCard icon={<Clock />} title="Chờ xử lý" value={`${stats.pending} đơn`} tone="amber" />
        <StatusCard icon={<AlertCircle />} title="Đã xác nhận" value={`${stats.confirmed} đơn`} tone="blue" />
        <StatusCard icon={<Truck />} title="Đang giao" value={`${stats.shipping} đơn`} tone="purple" />
        <StatusCard icon={<CheckCircle2 />} title="Hoàn thành" value={`${stats.completed} đơn`} tone="green" />
        <StatusCard icon={<XCircle />} title="Đã hủy" value={`${stats.cancelled} đơn`} tone="red" />
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-chart-card">
          <div className="chart-header">
            <div>
              <h2>Biểu đồ doanh thu</h2>
              <p>Chỉ tính các đơn hàng đã hoàn thành.</p>
            </div>

            <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
              <option value={7}>7 ngày qua</option>
              <option value={30}>30 ngày qua</option>
            </select>
          </div>

          <div className="chart-body">
            {revenueChart.map((item, index) => {
              const height = Math.max((item.value / maxRevenue) * 100, 4)

              return (
                <div key={`${item.label}-${index}`} className="chart-column">
                  <div className="chart-tooltip">{fmtCur(item.value)}</div>
                  <div className="chart-bar" style={{ height: `${height}%` }} />
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="dashboard-health-card">
          <div className="health-header">
            <TrendingUp size={24} />
            <div>
              <h2>Hiệu suất đơn hàng</h2>
              <p>Tỷ lệ hoàn thành hiện tại</p>
            </div>
          </div>

          <div className="progress-ring">
            <strong>{completionRate}%</strong>
            <span>Hoàn thành</span>
          </div>

          <div className="health-list">
            <div>
              <span>Đơn thành công</span>
              <strong>{stats.completed}</strong>
            </div>

            <div>
              <span>Đơn cần xử lý</span>
              <strong>{stats.pending + stats.confirmed}</strong>
            </div>

            <div>
              <span>Đơn đang giao</span>
              <strong>{stats.shipping}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="recent-orders-card">
        <div className="recent-header">
          <div>
            <h2>Đơn hàng gần đây</h2>
            <p>6 đơn hàng mới nhất trong hệ thống.</p>
          </div>
        </div>

        <div className="recent-table-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.customer_name || 'Khách hàng'}</strong>
                    <span>{order.phone || 'Chưa có SĐT'}</span>
                  </td>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('vi-VN')
                      : 'Không rõ'}
                  </td>
                  <td>{fmtCur(order.total_price)}</td>
                  <td>
                    <span className={`status-pill ${order.status}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}

              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="recent-empty">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({ icon, title, value, tone }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <div className="kpi-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  )
}

function StatusCard({ icon, title, value, tone }) {
  return (
    <article className={`status-card ${tone}`}>
      <div>{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  )
}