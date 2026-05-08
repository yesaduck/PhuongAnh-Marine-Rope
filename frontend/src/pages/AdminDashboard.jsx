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
        </div>
      </div>
    </div>
  )
}
