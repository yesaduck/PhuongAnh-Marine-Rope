import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/authService'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await loginAdmin(credentials)
      navigate('/admin')
    } catch {
      setError('Đăng nhập không thành công. Vui lòng kiểm tra tài khoản.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Đăng nhập Admin</h1>
        <p className="mt-2 text-sm text-slate-600">Quản lý sản phẩm và đơn hàng cho xưởng Phương Anh Rope.</p>
        {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-slate-700">
            Tên đăng nhập
            <input required value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Mật khẩu
            <input type="password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Đăng nhập</button>
        </form>
      </div>
    </div>
  )
}
