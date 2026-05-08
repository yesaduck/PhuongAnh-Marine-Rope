import { useEffect, useState } from 'react'
import { fetchOrders, updateOrderStatus } from '../services/orderService'

const orderStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      setError('Không thể tải đơn hàng.')
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
    } catch (err) {
      setError('Cập nhật trạng thái thất bại.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Quản lý đơn hàng</h1>
        <p className="mt-2 text-slate-600">Xem chi tiết đơn hàng và cập nhật trạng thái.</p>
      </div>

      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">Đơn hàng #{order.id}</p>
                <p className="text-sm text-slate-600">Khách hàng: {order.customer_name} • {order.phone}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{order.status}</span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Tổng tiền</p>
                <p className="mt-2 text-xl font-semibold text-brand-900">{Number(order.total_price).toLocaleString()} đ</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Số sản phẩm</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{order.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ngày đặt</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {orderStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(order.id, status)}
                  className="rounded-3xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Chi tiết đơn hàng</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                    <span>{item.product_name || `Sản phẩm #${item.product_id}`}</span>
                    <span className="font-semibold">{item.quantity} x {Number(item.price).toLocaleString()} đ</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
