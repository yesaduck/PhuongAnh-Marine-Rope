import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
<<<<<<< HEAD

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', address: '' })
  const [error, setError] = useState('')
=======
import toast, { Toaster } from 'react-hot-toast'
import { User, Mail, Phone, Lock, MapPin, Loader2 } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', address: '' })
  const [loading, setLoading] = useState(false)
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
<<<<<<< HEAD
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.')
=======
    setLoading(true)
    try {
      await register(form)
      toast.success('Đăng ký thành công! Hãy đăng nhập nhé.')
      navigate('/login')
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Email này đã được sử dụng.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Đăng ký</h1>
        <p className="mt-2 text-sm text-slate-600">Tạo tài khoản để mua dây ngư nghiệp chất lượng cao.</p>
        {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-slate-700">
            Họ và tên
            <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Số điện thoại
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Mật khẩu
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Địa chỉ
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" rows="3" />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Đăng ký</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản? <Link to="/login" className="text-brand-900 hover:underline">Đăng nhập</Link>
=======
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <Toaster position="top-right" />
      
      <div className="mx-auto w-full max-w-lg rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900">Tạo tài khoản</h1>
          <p className="mt-3 text-slate-500 font-medium">Nhận ưu đãi tốt nhất cho ngư cụ chất lượng cao.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Họ tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email liên hệ</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu bảo mật</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ nhận hàng</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-5 text-slate-400" size={18} />
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 outline-none focus:border-blue-500 transition-all" rows="2" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-[1.5rem] bg-blue-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'HOÀN TẤT ĐĂNG KÝ'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline">Vào đăng nhập</Link>
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
        </p>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
