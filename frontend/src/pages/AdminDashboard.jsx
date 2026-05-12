<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productService'
import { fetchOrders } from '../services/orderService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    const loadStats = async () => {
      const products = await fetchProducts({ limit: 100 })
      const orders = await fetchOrders()
      const revenue = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0)
      setStats({ products: products.total || products.length || 0, orders: orders.length, revenue })
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Bảng điều khiển</h1>
        <p className="mt-2 text-slate-600">Tổng quan nhanh về sản phẩm, đơn hàng và doanh thu.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tổng sản phẩm</p>
          <p className="mt-4 text-4xl font-bold text-brand-900">{stats.products}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tổng đơn hàng</p>
          <p className="mt-4 text-4xl font-bold text-brand-900">{stats.orders}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Doanh thu</p>
          <p className="mt-4 text-4xl font-bold text-brand-900">{stats.revenue.toLocaleString()} đ</p>
=======
import React, { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productService'
import { fetchOrders } from '../services/orderService'
import { fetchUsers } from '../services/userService'
import * as XLSX from 'xlsx'

const fmtCur = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0, pending: 0, completed: 0 })
  const [revenueChart, setRevenueChart] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(7)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [products, orders, users] = await Promise.all([
          fetchProducts({ limit: 1000 }),
          fetchOrders(),
          fetchUsers()
        ])
        const ords = Array.isArray(orders) ? orders : orders.items || []
        const revenue = ords.filter(o => o.status === 'completed').reduce((s, o) => s + Number(o.total_price || 0), 0)
        
        // Logic vẽ biểu đồ doanh thu
        const chart = Array.from({ length: range }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (range - 1 - i))
          const label = `${d.getDate()}/${d.getMonth() + 1}`
          const value = ords.filter(o => new Date(o.created_at).toDateString() === d.toDateString())
                            .reduce((s, o) => s + Number(o.total_price || 0), 0)
          return { label, value }
        })

        setRevenueChart(chart)
        setStats({
          products: products.length || 0,
          orders: ords.length,
          revenue,
          users: users.length || 0,
          pending: ords.filter(o => o.status === 'pending').length,
          completed: ords.filter(o => o.status === 'completed').length
        })
      } finally { setLoading(false) }
    }
    load()
  }, [range])

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([{ 'Tiêu chí': 'Doanh thu', 'Giá trị': stats.revenue }, { 'Tiêu chí': 'Đơn hàng', 'Giá trị': stats.orders }])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Thống kê")
    XLSX.writeFile(wb, "Bao-cao-Phuong-Anh.xlsx")
  }

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu thống kê...</div>

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
          <p className="text-slate-500">Số liệu cập nhật thời gian thực</p>
        </div>
        <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold">📥 Xuất báo cáo</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-500 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-bold">Doanh thu</p>
          <p className="text-xl font-black text-blue-600">{fmtCur(stats.revenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border-l-4 border-amber-500 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-bold">Chờ xử lý</p>
          <p className="text-xl font-black text-amber-600">{stats.pending} đơn</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-bold">Hoàn thành</p>
          <p className="text-xl font-black text-emerald-600">{stats.completed} đơn</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border-l-4 border-purple-500 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-bold">Khách hàng</p>
          <p className="text-xl font-black text-purple-600">{stats.users}</p>
        </div>
      </div>

      {/* Biểu đồ CSS thuần */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between mb-6">
          <h2 className="font-bold">Biểu đồ doanh thu</h2>
          <select className="border rounded-lg text-sm p-1" onChange={(e) => setRange(Number(e.target.value))}>
            <option value={7}>7 ngày qua</option>
            <option value={30}>30 ngày qua</option>
          </select>
        </div>
        <div className="flex items-end gap-2 h-40">
          {revenueChart.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500" style={{ height: `${(item.value / (Math.max(...revenueChart.map(v => v.value)) || 1)) * 100}%`, minHeight: '4px' }}>
                <span className="hidden group-hover:block absolute -top-8 bg-black text-white text-[10px] p-1 rounded whitespace-nowrap">{fmtCur(item.value)}</span>
              </div>
              <span className="text-[10px] text-slate-400 rotate-45 md:rotate-0">{item.label}</span>
            </div>
          ))}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
        </div>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
