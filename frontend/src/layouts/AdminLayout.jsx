<<<<<<< HEAD
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
=======
import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Box, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react'
import { logout } from '../services/authService'

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin', label: 'Tổng quan', icon: <LayoutDashboard size={20}/> },
    { to: '/admin/products', label: 'Sản phẩm', icon: <Box size={20}/> },
    { to: '/admin/orders', label: 'Đơn hàng', icon: <ShoppingCart size={20}/> },
    { to: '/admin/users', label: 'Người dùng', icon: <Users size={20}/> },
  ]

  const handleLogout = () => { logout(); navigate('/login'); }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#001529] text-white transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-xl`}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-black tracking-tighter">PHƯƠNG ANH ROPE</h2>
          <button className="md:hidden" onClick={() => setIsOpen(false)}><X/></button>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${location.pathname === item.to ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {item.icon} <span className="font-bold">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all mt-10">
            <LogOut size={20}/> <span className="font-bold">Đăng xuất</span>
          </button>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 bg-white border-b flex items-center px-6 md:hidden">
          <button onClick={() => setIsOpen(true)}><Menu/></button>
          <h2 className="ml-4 font-bold">Admin Panel</h2>
        </header>
        <main className="p-2 md:p-8 overflow-y-auto max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
