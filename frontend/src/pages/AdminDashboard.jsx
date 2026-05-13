import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { fetchProducts } from '../services/productService'
import { fetchOrders } from '../services/orderService'
import { fetchUsers } from '../services/userService'
import './AdminDashboard.css'

const fmtCur = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
    pending: 0,
    completed: 0,
    shipping: 0,
    cancelled: 0
  })

  const [revenueChart, setRevenueChart] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(7)

  useEffect(() => {
    loadDashboard()
  }, [range])

  const maxRevenue = useMemo(() => {
    return Math.max(...revenueChart.map((item) => item.value), 1)
  }, [revenueChart])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [productsData, ordersData, usersData] = await Promise.all([
        fetchProducts({ limit: 1000 }),
        fetchOrders(),
        fetchUsers()
      ])

      const products = productsData.items || productsData || []
      const orders = Array.isArray(ordersData) ? ordersData : ordersData.items || []
      const users = Array.isArray(usersData) ? usersData : usersData.items || []

      const completedOrders = orders.filter((order) => order.status === 'completed')

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

      setRevenueChart(chart)

      setStats({
        products: products.length,
        orders: orders.length,
        revenue,
        users: users.length,
        pending: orders.filter((order) => order.status === 'pending').length,
        completed: completedOrders.length,
        shipping: orders.filter((order) => order.status === 'shipping').length,
        cancelled: orders.filter((order) => order.status === 'cancelled').length
      })
    } finally {
      setLoading(false)
    }
  }

  const exportExcel = () => {
    const summaryRows = [
      { 'Tiêu chí': 'Doanh thu', 'Giá trị': stats.revenue },
      { 'Tiêu chí': 'Tổng đơn hàng', 'Giá trị': stats.orders },
      { 'Tiêu chí': 'Đơn chờ xử lý', 'Giá trị': stats.pending },
      { 'Tiêu chí': 'Đơn đang giao', 'Giá trị': stats.shipping },
      { 'Tiêu chí': 'Đơn hoàn thành', 'Giá trị': stats.completed },
      { 'Tiêu chí': 'Đơn đã hủy', 'Giá trị': stats.cancelled },
      { 'Tiêu chí': 'Sản phẩm', 'Giá trị': stats.products },
      { 'Tiêu chí': 'Khách hàng', 'Giá trị': stats.users }
    ]

    const chartRows = revenueChart.map((item) => ({
      Ngày: item.label,
      'Doanh thu': item.value
    }))

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryRows),
      'TongQuan'
    )

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(chartRows),
      'BieuDoDoanhThu'
    )

    XLSX.writeFile(workbook, 'bao-cao-phuong-anh-rope.xlsx')
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Đang tải dữ liệu thống kê...
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      <section className="dashboard-hero">
        <div>
          <h1>Tổng quan hệ thống</h1>
          <p>Số liệu cập nhật theo đơn hàng, sản phẩm và khách hàng.</p>
        </div>

        <button type="button" className="export-report-btn" onClick={exportExcel}>
          Xuất báo cáo
        </button>
      </section>

      <section className="dashboard-stats-grid">
        <StatCard title="Doanh thu" value={fmtCur(stats.revenue)} tone="blue" />
        <StatCard title="Chờ xử lý" value={`${stats.pending} đơn`} tone="amber" />
        <StatCard title="Đang giao" value={`${stats.shipping} đơn`} tone="purple" />
        <StatCard title="Hoàn thành" value={`${stats.completed} đơn`} tone="green" />
        <StatCard title="Sản phẩm" value={stats.products} tone="slate" />
        <StatCard title="Khách hàng" value={stats.users} tone="violet" />
        <StatCard title="Tổng đơn" value={stats.orders} tone="cyan" />
        <StatCard title="Đã hủy" value={`${stats.cancelled} đơn`} tone="red" />
      </section>

      <section className="dashboard-chart-card">
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

                <div
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                />

                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatCard({ title, value, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  )
}