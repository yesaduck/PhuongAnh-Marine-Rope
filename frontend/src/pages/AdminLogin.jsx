import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Fish
} from 'lucide-react'
import { loginAdmin } from '../services/authService'
import './AdminLogin.css'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!credentials.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập.')
      return
    }

    if (!credentials.password) {
      setError('Vui lòng nhập mật khẩu.')
      return
    }

    try {
      setLoading(true)
      await loginAdmin({
        username: credentials.username.trim(),
        password: credentials.password
      })

      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Đăng nhập không thành công. Vui lòng kiểm tra tài khoản.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <header className="admin-login-header">
        <div className="admin-login-header-inner">
          <Link to="/" className="admin-login-logo">
            <span className="admin-login-logo-icon">
              <Fish size={24} />
            </span>
            <span>Phương Anh Rope</span>
          </Link>

          <span className="admin-login-header-title">
            Trang quản trị
          </span>
        </div>
      </header>

      <main className="admin-login-main">
        <section className="admin-login-hero">
          <div className="admin-login-hero-icon">
            <ShieldCheck size={88} />
          </div>

          <h1>Hệ thống quản trị</h1>

          <p>
            Quản lý sản phẩm, đơn hàng, người dùng và thống kê
            toàn bộ hoạt động của cửa hàng.
          </p>

          <div className="admin-login-benefits">
            <div>✔ Quản lý sản phẩm</div>
            <div>✔ Theo dõi đơn hàng</div>
            <div>✔ Thống kê doanh thu</div>
            <div>✔ Phân quyền người dùng</div>
          </div>
        </section>

        <section className="admin-login-box">
          <div className="admin-login-box-header">
            <h2>Đăng nhập Admin</h2>
            <p>Nhập tài khoản quản trị để tiếp tục.</p>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="admin-login-field">
              <label>Tên đăng nhập</label>

              <div className="admin-login-input-wrap">
                <span>
                  <User size={18} />
                </span>

                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={credentials.username}
                  onChange={(e) =>
                    handleChange('username', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label>Mật khẩu</label>

              <div className="admin-login-input-wrap">
                <span>
                  <Lock size={18} />
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={credentials.password}
                  onChange={(e) =>
                    handleChange('password', e.target.value)
                  }
                />

                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}