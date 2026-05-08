import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(credentials)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-600">Chào mừng bạn quay trở lại Phương Anh Rope.</p>
        {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-slate-700">
            Email
            <input type="email" required value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <label className="block text-sm text-slate-700">
            Mật khẩu
            <input type="password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-700" />
          </label>
          <button type="submit" className="w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Đăng nhập</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản? <Link to="/register" className="text-brand-900 hover:underline">Đăng ký</Link>
        </p>
      </div>
    </div>
  )
}
