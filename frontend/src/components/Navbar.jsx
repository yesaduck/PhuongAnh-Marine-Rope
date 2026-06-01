import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Menu,
  X,
  User,
  ChevronDown,
  ShoppingCart,
  Shield,
  LogOut,
  Fish,
  ArrowUp
} from 'lucide-react'
import { getCart } from '../services/cartService'
import { getToken, getUserRole, getUser, logout } from '../services/authService'
import './Navbar.css'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)

  function refreshCartCount() {
    const cart = getCart()
    setCartCount(
      cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    )
  }

  const token = getToken()
  const role = getUserRole()
  const user = getUser()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [hideNavbar, setHideNavbar] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)

  const accountRef = useRef(null)
  const lastScrollY = useRef(0)

  const displayName =
    user?.full_name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Tài khoản'

  const isAdmin = role === 'admin' || role === 'staff'

  useEffect(() => {
    refreshCartCount()

    const handleCartChanged = () => refreshCartCount()

    window.addEventListener('pa_cart_changed', handleCartChanged)
    window.addEventListener('storage', handleCartChanged)

    return () => {
      window.removeEventListener('pa_cart_changed', handleCartChanged)
      window.removeEventListener('storage', handleCartChanged)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY

      setShowBackTop(currentY > 360)

      if (currentY > lastScrollY.current && currentY > 120) {
        setHideNavbar(true)
        setAccountOpen(false)
        setMobileOpen(false)
      } else {
        setHideNavbar(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = () => {
    setMobileOpen(false)
    setAccountOpen(false)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }, 50)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className={`site-navbar ${hideNavbar ? 'navbar-hidden' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
            <span className="navbar-logo-icon">
              <Fish size={23} />
            </span>

            <span className="navbar-logo-text">
              Phương Anh Rope
            </span>
          </Link>

          <button
            type="button"
            className="navbar-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
            <NavLink to="/products" onClick={() => setMobileOpen(false)}>
              Sản phẩm
            </NavLink>

            <NavLink to="/about" onClick={() => setMobileOpen(false)}>
              Giới thiệu
            </NavLink>

            <NavLink to="/contact" onClick={() => setMobileOpen(false)}>
              Liên hệ
            </NavLink>

            {token && (
              <NavLink
                to="/cart"
                className="navbar-cart"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingCart size={17} />
                <span>Giỏ hàng</span>
                {cartCount > 0 && <strong>{cartCount}</strong>}
              </NavLink>
            )}

            {!token ? (
              <div className="navbar-auth">
                <Link
                  to="/login"
                  className="navbar-login"
                  onClick={() => setMobileOpen(false)}
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="navbar-register"
                  onClick={() => setMobileOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="navbar-account" ref={accountRef}>
                <button
                  type="button"
                  className="navbar-account-btn"
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  <span className="navbar-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </span>

                  <span className="navbar-account-name">
                    {displayName}
                  </span>

                  <ChevronDown
                    size={16}
                    className={accountOpen ? 'rotate' : ''}
                  />
                </button>

                {accountOpen && (
                  <div className="navbar-dropdown">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setAccountOpen(false)
                        setMobileOpen(false)
                      }}
                    >
                      <User size={16} />
                      <span>Thông tin tài khoản</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => {
                          setAccountOpen(false)
                          setMobileOpen(false)
                        }}
                      >
                        <Shield size={16} />
                        <span>Trang quản trị</span>
                      </Link>
                    )}

                    <button type="button" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <button
        type="button"
        className={`back-to-top ${showBackTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Quay về đầu trang"
      >
        <ArrowUp size={20} />
      </button>
    </>
  )
}