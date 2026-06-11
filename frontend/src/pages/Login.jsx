import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import toast, { Toaster } from 'react-hot-toast'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Fish,
  ShoppingBag,
  ShieldCheck,
  Truck
} from 'lucide-react'
import { firebaseAuth, googleProvider } from '../firebase'
import { login, socialLogin } from '../services/authService'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const email = credentials.email.trim()

    if (!email) {
      newErrors.email = 'Vui lòng nhập email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không đúng định dạng.'
    }

    if (!credentials.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading || googleLoading) return

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng nhập.')
      return
    }

    try {
      setLoading(true)

      await login({
        email: credentials.email.trim(),
        password: credentials.password
      })

      toast.success('Đăng nhập thành công!')

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Email hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (loading || googleLoading) return

    try {
      setGoogleLoading(true)

      const result = await signInWithPopup(firebaseAuth, googleProvider)
      const user = result.user

      await socialLogin({
        email: user.email,
        full_name: user.displayName || user.email?.split('@')[0]
      })

      toast.success('Đăng nhập Google thành công!')

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (err) {
      console.error('Google Login Error:', err)

      if (err.code === 'auth/popup-blocked') {
        toast.error('Trình duyệt đang chặn popup Google. Hãy cho phép popup.')
      } else if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Bạn đã đóng cửa sổ đăng nhập Google.')
      } else {
        toast.error(err.response?.data?.error || 'Không thể đăng nhập bằng Google.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="login-shop-page">
      <Toaster position="top-right" />

      <header className="login-shop-header">
        <div className="login-shop-header-inner">
          <Link to="/" className="login-shop-logo">
            <span className="login-logo-icon">
              <Fish size={24} />
            </span>
            <span>Phương Anh Rope</span>
          </Link>

          <span className="login-header-title">Đăng nhập</span>

          <Link to="/contact" className="login-help-link">
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>

      <main className="login-shop-main">
        <section className="login-hero">
          <div className="login-big-logo">
            <ShoppingBag size={96} />
          </div>

          <h1>Phương Anh Rope</h1>

          <p>
            Chuyên cung cấp dây ngư nghiệp chất lượng cao cho ngư dân,
            đại lý và khách hàng sỉ.
          </p>

          <div className="login-benefits">
            <div>
              <ShieldCheck size={20} />
              <span>Mua hàng an toàn</span>
            </div>

            <div>
              <Truck size={20} />
              <span>Hỗ trợ giao hàng nhanh</span>
            </div>
          </div>
        </section>

        <section className="login-box">
          <div className="login-box-header">
            <h2>Đăng nhập</h2>
            <Link to="/register">Đăng ký</Link>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <InputField
              icon={<Mail size={17} />}
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <InputField
              icon={<Lock size={17} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              rightButton={
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <button
              type="submit"
              className="login-submit"
              disabled={loading || googleLoading}
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

            <div className="login-forgot">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <div className="login-divider">
              <span>Hoặc</span>
            </div>

            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Đang đăng nhập Google...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Đăng nhập với Google
                </>
              )}
            </button>

            <div className="login-register-line">
              Bạn mới biết đến Phương Anh Rope?
              <Link to="/register"> Đăng ký</Link>
            </div>
          </form>
        </section>
      </main>

      <footer className="login-shop-footer">
        <div className="login-footer-grid">
          <div>
            <h3>Phương Anh Rope</h3>
            <p>Chuyên cung cấp dây ngư nghiệp chất lượng cao.</p>
          </div>

          <div>
            <h3>Liên hệ</h3>
            <p>Hotline: 0901 234 567</p>
            <p>Email: contact@phuonganhrope.vn</p>
          </div>

          <div>
            <h3>Hỗ trợ khách hàng</h3>
            <p>Chính sách bảo hành</p>
            <p>Chính sách giao hàng</p>
          </div>
        </div>

        <p className="login-copyright">
          © 2026 Phương Anh Rope. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function InputField({ icon, error, rightButton, ...props }) {
  return (
    <div className="login-field">
      <div className={`login-input-wrap ${error ? 'has-error' : ''}`}>
        <span>{icon}</span>
        <input {...props} />
        {rightButton}
      </div>

      {error && <p className="login-error">{error}</p>}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg
      className="google-icon"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.4l6.3 5.3C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}