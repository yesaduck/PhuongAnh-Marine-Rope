import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Fish,
  Menu,
  X
} from 'lucide-react'
import { logout } from '../services/authService'
import './AdminLayout.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }

    return location.pathname.startsWith(path)
  }

  const menuItems = [
    {
      to: '/admin',
      label: 'Tổng quan',
      icon: <LayoutDashboard size={19} />
    },
    {
      to: '/admin/products',
      label: 'Sản phẩm',
      icon: <Package size={19} />
    },
    {
      to: '/admin/orders',
      label: 'Đơn hàng',
      icon: <ShoppingCart size={19} />
    },
    {
      to: '/admin/users',
      label: 'Người dùng',
      icon: <Users size={19} />
    }
  ]

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          onClick={closeMobileMenu}
          aria-label="Đóng menu"
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-top">
          <Link to="/admin" className="admin-logo" onClick={closeMobileMenu}>
            <span className="admin-logo-icon">
              <Fish size={22} />
            </span>

            <div className="admin-logo-text">
              <strong>Phương Anh Rope</strong>
              <span>Admin Dashboard</span>
            </div>
          </Link>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Đóng sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMobileMenu}
              className={`admin-sidebar-link ${isActive(item.to) ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Đăng xuất</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-menu-btn mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>

            <button
              type="button"
              className="admin-menu-btn desktop-collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>Trang quản trị</h1>
              <p>Quản lý sản phẩm, đơn hàng và khách hàng.</p>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}