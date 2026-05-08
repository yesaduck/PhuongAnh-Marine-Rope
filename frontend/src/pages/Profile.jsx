import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, updateProfile, logout } from '../services/authService'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const data = await getProfile()
    setUser(data)
    setFormData(data)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const updated = await updateProfile(formData)
      setUser(updated)
      setEditing(false)
      setMessage('Cập nhật thông tin thành công.')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Cập nhật thất bại.')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">Thông tin cá nhân</h1>
          <button onClick={handleLogout} className="rounded-3xl bg-red-500 px-4 py-2 text-sm text-white">Đăng xuất</button>
        </div>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}

        {!editing ? (
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Họ tên</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Số điện thoại</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Vai trò</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user.role}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Địa chỉ</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{user.address || 'Chưa cập nhật'}</p>
            </div>
            <button onClick={() => setEditing(true)} className="mt-6 rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Chỉnh sửa</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-700">
                Họ tên
                <input required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
              </label>
              <label className="block text-sm text-slate-700">
                Email
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
              </label>
              <label className="block text-sm text-slate-700">
                Số điện thoại
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
              </label>
            </div>
            <label className="block text-sm text-slate-700">
              Địa chỉ
              <textarea rows="3" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
            </label>
            <div className="flex gap-4">
              <button type="submit" className="rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Lưu thay đổi</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-3xl border border-slate-300 px-6 py-3 text-sm text-slate-700">Hủy</button>
            </div>
            <div className="mt-6">
              <Link to="/my-orders" className="text-brand-900 hover:underline">Xem lịch sử đơn hàng</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
