import { useEffect, useState } from 'react'
import { fetchUsers, updateUser, deleteUser } from '../services/userService'

const emptyForm = { full_name: '', email: '', phone: '', role: 'customer', address: '' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await fetchUsers()
    setUsers(data)
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      address: user.address || ''
    })
    setMessage('')
    setError('')
  }

  const handleDelete = async (id) => {
    await deleteUser(id)
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (!editingId) {
        setError('Chọn một người dùng để cập nhật.')
        return
      }
      await updateUser(editingId, form)
      setMessage('Cập nhật người dùng thành công.')
      setError('')
      setEditingId(null)
      setForm(emptyForm)
      loadUsers()
    } catch (err) {
      setError(err.response?.data?.error || 'Cập nhật thất bại.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Quản lý người dùng</h1>
        <p className="mt-2 text-slate-600">Xem và cập nhật vai trò, thông tin người dùng trong hệ thống.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Danh sách người dùng</h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{user.full_name}</p>
                  <p className="text-sm text-slate-600">{user.email} • {user.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleEdit(user)} className="rounded-3xl bg-brand-900 px-4 py-2 text-sm font-semibold text-white">Sửa</button>
                  <button onClick={() => handleDelete(user.id)} className="rounded-3xl bg-red-500 px-4 py-2 text-sm font-semibold text-white">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">{editingId ? 'Cập nhật người dùng' : 'Chọn người dùng để sửa'}</h2>
          {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
          {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-700">
              Họ tên
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
            </label>
            <label className="block text-sm text-slate-700">
              Email
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
            </label>
            <label className="block text-sm text-slate-700">
              Số điện thoại
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
            </label>
            <label className="block text-sm text-slate-700">
              Vai trò
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none">
                <option value="customer">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block text-sm text-slate-700">
              Địa chỉ
              <textarea rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none" />
            </label>
            <button type="submit" className="rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Lưu thay đổi</button>
          </form>
        </div>
      </div>
    </div>
  )
}
