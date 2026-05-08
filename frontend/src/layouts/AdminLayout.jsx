import { Outlet, Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-brand-900 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Admin Phương Anh Rope</h1>
        <button onClick={handleLogout} className="bg-slate-50 text-brand-900 px-4 py-2 rounded">Đăng xuất</button>
      </header>
      <div className="md:flex">
        <aside className="md:w-60 bg-white border-r border-slate-200 p-6">
          <nav className="space-y-3">
            <Link to="/admin" className="block text-slate-700 hover:text-brand-900">Tổng quan</Link>
            <Link to="/admin/products" className="block text-slate-700 hover:text-brand-900">Quản lý sản phẩm</Link>
            <Link to="/admin/orders" className="block text-slate-700 hover:text-brand-900">Quản lý đơn hàng</Link>
            <Link to="/admin/users" className="block text-slate-700 hover:text-brand-900">Quản lý người dùng</Link>
          </nav>
        </aside>
        <section className="flex-1 p-6">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
