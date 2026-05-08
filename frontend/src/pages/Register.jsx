import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authService'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', address: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.')
    }
  }

  return (
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
        </p>
      </div>
    </div>
  )
}
