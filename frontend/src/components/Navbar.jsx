import { Link, useNavigate } from 'react-router-dom'
import { getCart } from '../services/cartService'
import { getToken, getUserRole, logout } from '../services/authService'

export default function Navbar() {
  const cart = getCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const navigate = useNavigate()
  const token = getToken()
  const role = getUserRole()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-brand-900 text-xl font-bold">Phương Anh Rope</Link>
          <button className="md:hidden text-slate-700" onClick={() => navigate('/products')}>Sản phẩm</button>
        </div>
        <nav className="mt-4 flex flex-wrap gap-4 md:mt-0 md:items-center">
          <Link to="/products" className="text-slate-700 hover:text-brand-900">Sản phẩm</Link>
          <Link to="/about" className="text-slate-700 hover:text-brand-900">Giới thiệu</Link>
          <Link to="/contact" className="text-slate-700 hover:text-brand-900">Liên hệ</Link>
          {token && (
            <Link to="/cart" className="relative text-slate-700 hover:text-brand-900">
              Giỏ hàng
              {totalItems > 0 && <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-900 text-white text-xs">{totalItems}</span>}
            </Link>
          )}
          {token ? (
            <>
              {(role === 'admin' || role === 'staff') && <Link to="/admin" className="text-slate-700 hover:text-brand-900">Admin</Link>}
              <Link to="/profile" className="text-slate-700 hover:text-brand-900">Tài khoản</Link>
              <button onClick={handleLogout} className="text-slate-700 hover:text-brand-900">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 hover:text-brand-900">Đăng nhập</Link>
              <Link to="/register" className="text-slate-700 hover:text-brand-900">Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
