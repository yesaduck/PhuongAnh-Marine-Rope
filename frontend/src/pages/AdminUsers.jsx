import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { fetchUsers, updateUser, deleteUser } from '../services/userService'
import './AdminUsers.css'

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
  role: 'customer',
  address: ''
}

const roles = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'staff', label: 'Nhân viên' },
  { value: 'admin', label: 'Admin' }
]

const roleMap = Object.fromEntries(roles.map((role) => [role.value, role.label]))

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return users.filter((user) => {
      const matchSearch =
        !keyword ||
        user.full_name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.includes(keyword)

      const matchRole = !roleFilter || user.role === roleFilter

      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Không thể tải danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))

    setFormErrors((prev) => ({
      ...prev,
      [field]: ''
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!form.full_name.trim()) {
      errors.full_name = 'Chưa nhập họ tên người dùng.'
    }

    if (!form.email.trim()) {
      errors.email = 'Chưa nhập email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email không đúng định dạng.'
    }

    if (form.phone && !/^(0|\+84)[0-9]{9,10}$/.test(form.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ.'
    }

    if (!form.role) {
      errors.role = 'Chưa chọn vai trò.'
    }

    setFormErrors(errors)

    const firstError = Object.values(errors)[0]
    if (firstError) toast.error(firstError)

    return Object.keys(errors).length === 0
  }

  const openEditModal = (user) => {
    setEditingId(user.id)
    setForm({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      address: user.address || ''
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!editingId) {
      toast.error('Chọn một người dùng để cập nhật.')
      return
    }

    if (!validateForm()) return

    try {
      setLoading(true)

      await updateUser(editingId, {
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim()
      })

      toast.success('Cập nhật người dùng thành công.')
      closeModal()
      await loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cập nhật thất bại.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return

    try {
      setLoading(true)
      await deleteUser(confirmDelete.id)
      setUsers((prev) => prev.filter((user) => user.id !== confirmDelete.id))
      toast.success('Xóa người dùng thành công.')
      setConfirmDelete(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xóa người dùng thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-users-page">
      <Toaster position="top-right" />

      <section className="users-hero">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Xem, tìm kiếm và cập nhật vai trò người dùng trong hệ thống.</p>
        </div>

        <button type="button" className="refresh-btn" onClick={loadUsers}>
          Làm mới
        </button>
      </section>

      <section className="users-card">
        <div className="users-toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email hoặc số điện thoại..."
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="users-summary">
          <span>Tổng người dùng: {users.length}</span>
          <span>Đang hiển thị: {filteredUsers.length}</span>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Địa chỉ</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.full_name || 'Chưa có tên'}</strong>
                    <span>ID: {user.id}</span>
                  </td>

                  <td>{user.email}</td>
                  <td>{user.phone || 'Chưa có'}</td>

                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {roleMap[user.role] || user.role}
                    </span>
                  </td>

                  <td>{user.address || 'Chưa có'}</td>

                  <td>
                    <div className="user-actions">
                      <button type="button" onClick={() => openEditModal(user)}>
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => setConfirmDelete(user)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-users">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="user-modal-overlay">
          <form className="user-modal" onSubmit={handleSubmit}>
            <div className="modal-header">
              <div>
                <h2>Cập nhật người dùng</h2>
                <p>Sửa thông tin tài khoản và phân quyền người dùng.</p>
              </div>

              <button type="button" className="close-modal-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="user-form-grid">
              <label className={formErrors.full_name ? 'field-error' : ''}>
                Họ tên <span>*</span>
                <input
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
                {formErrors.full_name && <small>{formErrors.full_name}</small>}
              </label>

              <label className={formErrors.email ? 'field-error' : ''}>
                Email <span>*</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@gmail.com"
                />
                {formErrors.email && <small>{formErrors.email}</small>}
              </label>

              <label className={formErrors.phone ? 'field-error' : ''}>
                Số điện thoại
                <input
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0901234567"
                />
                {formErrors.phone && <small>{formErrors.phone}</small>}
              </label>

              <label className={formErrors.role ? 'field-error' : ''}>
                Vai trò <span>*</span>
                <select
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {formErrors.role && <small>{formErrors.role}</small>}
              </label>

              <label className="full">
                Địa chỉ
                <textarea
                  rows="3"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ nếu có"
                />
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={closeModal}>
                Hủy
              </button>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc muốn xóa người dùng <strong>{confirmDelete.full_name}</strong>?
              Thao tác này không thể hoàn tác.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>

              <button type="button" className="danger-btn" onClick={handleDelete}>
                Xóa người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}