import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Fish
} from 'lucide-react'
import { register } from '../services/authService'
import './Register.css'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = useMemo(() => {
    let score = 0
    if (form.password.length >= 8) score++
    if (/[A-Z]/.test(form.password)) score++
    if (/[0-9]/.test(form.password)) score++
    if (/[^A-Za-z0-9]/.test(form.password)) score++
    return score
  }, [form.password])

  const strengthLabel = ['Rất yếu', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'][passwordStrength]

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.full_name.trim()) newErrors.full_name = 'Vui lòng nhập họ tên.'
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.'
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(form.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.'

    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email không đúng định dạng.'

    if (!form.password) newErrors.password = 'Vui lòng nhập mật khẩu.'
    else if (form.password.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.'

    if (!form.confirmPassword) newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.'
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng ký.')
      return
    }

    setLoading(true)

    try {
      await register({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password
      })

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1000)
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Email hoặc số điện thoại đã được sử dụng.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-shop-page">
      <Toaster position="top-right" />

      <header className="register-shop-header">
        <div className="register-shop-header-inner">
          <Link to="/" className="register-shop-logo">
            <span className="register-logo-icon">
              <Fish size={24} />
            </span>
            <span>Phương Anh Rope</span>
          </Link>

          <span className="register-header-title">Đăng ký</span>

          <Link to="/contact" className="register-help-link">
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>

      <main className="register-shop-main">
        <section className="register-hero">
          <div className="register-big-logo">
            <ShoppingBag size={96} />
          </div>

          <h1>Phương Anh Rope</h1>

          <p>
            Chuyên cung cấp dây ngư nghiệp chất lượng cao cho ngư dân,
            đại lý và khách hàng sỉ.
          </p>

          <div className="hero-benefits">
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

        <section className="register-box">
          <div className="register-box-header">
            <h2>Đăng ký</h2>
            <Link to="/login">Đã có tài khoản?</Link>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="register-row">
              <InputField
                icon={<User size={17} />}
                placeholder="Họ tên"
                value={form.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                error={errors.full_name}
              />

              <InputField
                icon={<Phone size={17} />}
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
              />
            </div>

            <InputField
              icon={<Mail size={17} />}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <InputField
              icon={<Lock size={17} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              rightButton={
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {form.password && (
              <div className="register-strength">
                <div className="register-strength-top">
                  <span>Độ mạnh mật khẩu</span>
                  <strong>{strengthLabel}</strong>
                </div>

                <div className="register-strength-bars">
                  {[1, 2, 3, 4].map((item) => (
                    <span
                      key={item}
                      className={passwordStrength >= item ? 'active' : ''}
                    />
                  ))}
                </div>
              </div>
            )}

            <InputField
              icon={<Lock size={17} />}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              rightButton={
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <button className="register-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>

            <p className="register-policy">
              Bằng việc đăng ký, bạn đã đồng ý với Phương Anh Rope về
              <Link to="/terms"> Điều khoản dịch vụ </Link>
              và
              <Link to="/privacy"> Chính sách bảo mật</Link>.
            </p>

            <div className="register-login-line">
              Bạn đã có tài khoản?
              <Link to="/login"> Đăng nhập</Link>
            </div>
          </form>
        </section>
      </main>

      <footer className="register-shop-footer">
        <div className="register-footer-grid">
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

        <p className="register-copyright">
          © 2026 Phương Anh Rope. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function InputField({ icon, error, rightButton, ...props }) {
  return (
    <div className="register-field">
      <div className={`register-input-wrap ${error ? 'has-error' : ''}`}>
        <span>{icon}</span>
        <input {...props} />
        {rightButton}
      </div>

      {error && <p className="register-error">{error}</p>}
    </div>
  )
}