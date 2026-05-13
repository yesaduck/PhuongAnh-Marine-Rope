import { useState } from 'react'
import { createOrder } from '../services/orderService'
import { getCart, clearCart } from '../services/cartService'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', note: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await createOrder({ ...form, total_price: total, items: cart })
      clearCart()
      setSuccess('Đặt hàng thành công. Chúng tôi sẽ liên hệ lại với bạn sớm nhất.')
      setError('')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError('Có lỗi trong quá trình gửi đơn hàng. Vui lòng thử lại.')
      setSuccess('')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Thanh toán</h1>
      <p className="mt-2 text-slate-600">Nhập thông tin giao hàng để hoàn tất đơn hàng.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Họ tên
              <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Số điện thoại
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
            </label>
          </div>
          <label className="space-y-2 text-sm text-slate-700">
            Địa chỉ giao hàng
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Ghi chú
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows="4" className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Gửi đặt hàng</button>
        </form>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tổng đơn hàng</h2>
            <p className="mt-3 text-3xl font-bold text-brand-900">{total.toLocaleString()} đ</p>
          </div>
          <div className="space-y-3">
            <a href="tel:0901234567" className="block rounded-3xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-900">Gọi nhanh</a>
            <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" className="block rounded-3xl bg-brand-900 px-5 py-3 text-center font-semibold text-white">Chat Zalo</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
