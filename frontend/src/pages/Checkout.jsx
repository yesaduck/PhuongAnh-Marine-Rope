import { useState } from 'react'
import { createOrder } from '../services/orderService'
import { getCart, clearCart } from '../services/cartService'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD

export default function Checkout() {
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', note: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
=======
import { Phone, MessageSquare, CheckCircle2, ShieldCheck, MapPin, User, Notebook } from 'lucide-react'

export default function Checkout() {
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', note: '' })
  const [loading, setLoading] = useState(false)
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  const navigate = useNavigate()
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (event) => {
    event.preventDefault()
<<<<<<< HEAD
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
=======
    setLoading(true)
    try {
      await createOrder({ ...form, total_price: total, items: cart })
      clearCart()
      // Chuyển sang trang cám ơn hoặc thông báo thành công
      alert("Đặt hàng thành công! Chúng tôi sẽ gọi cho bạn ngay.")
      navigate('/')
    } catch (err) {
      alert("Lỗi khi gửi đơn hàng. Vui lòng thử lại!")
    } finally { setLoading(false) }
  }

  if (cart.length === 0) navigate('/products')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">XÁC NHẬN ĐƠN HÀNG</h1>
        <p className="text-slate-500 font-medium flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500"/> Thông tin của bạn được bảo mật tuyệt đối
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form Nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
                  <User size={12}/> Họ tên người nhận
                </label>
                <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-blue-100 transition-all font-bold text-slate-800" placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
                  <Phone size={12}/> Số điện thoại
                </label>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-blue-100 transition-all font-bold text-slate-800" placeholder="090..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
                <MapPin size={12}/> Địa chỉ nhận hàng
              </label>
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-blue-100 transition-all font-bold text-slate-800" placeholder="Số nhà, tên đường, tỉnh thành..." />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
                <Notebook size={12}/> Ghi chú đơn hàng (Tùy chọn)
              </label>
              <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows="3"
                className="w-full bg-slate-50 border-none rounded-3xl p-4 outline-none focus:ring-2 ring-blue-100 transition-all font-medium text-slate-600" placeholder="VD: Giao giờ hành chính, gọi trước khi đến..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 uppercase tracking-tighter">
              {loading ? 'Đang gửi...' : 'Hoàn tất đặt hàng'} <CheckCircle2 size={24}/>
            </button>
          </div>
        </form>

        {/* Sidebar Support */}
        <aside className="space-y-4">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Thanh toán khi nhận</h2>
            <div className="text-3xl font-black text-white leading-none mb-10">
              {total.toLocaleString()}₫
              <span className="block text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em] font-medium">Tổng số tiền cần trả</span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium italic">
              "Kiểm tra hàng trước khi thanh toán. Phương Anh Rope cam kết chất lượng chuẩn xưởng."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <a href="tel:0901234567" className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-100 rounded-3xl hover:bg-blue-50 transition-all group">
                <Phone className="text-blue-500 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Gọi điện</span>
             </a>
             <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-100 rounded-3xl hover:bg-emerald-50 transition-all group">
                <MessageSquare className="text-emerald-500 group-hover:scale-110 transition-transform" size={24}/>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Chat Zalo</span>
             </a>
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
          </div>
        </aside>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
