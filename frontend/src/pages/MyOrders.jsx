import { useEffect, useState } from 'react'
import { fetchMyOrders } from '../services/orderService'

export default function MyOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchMyOrders()
      setOrders(data)
    }
    loadOrders()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Đơn hàng của tôi</h1>
        <p className="mt-2 text-slate-600">Lịch sử đơn hàng và trạng thái giao hàng.</p>

        {orders.length === 0 ? (
          <div className="mt-8 text-center text-slate-500">Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Đơn hàng #{order.id}</p>
                    <p className="text-sm text-slate-600">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-brand-900">{Number(order.total_price).toLocaleString()} đ</span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Chi tiết sản phẩm</p>
                  <ul className="mt-3 space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-700">Sản phẩm ID: {item.product_id}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.quantity} x {Number(item.price).toLocaleString()} đ</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
