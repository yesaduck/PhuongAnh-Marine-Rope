import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Phone, Mail, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react'
import { sendContact } from '../services/contactService'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ tên'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!form.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      await sendContact({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        message: form.message.trim()
      })

      toast.success('Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm.')
      setSuccessModal(true)

      setForm({
        full_name: '',
        email: '',
        message: ''
      })
      setErrors({})
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gửi liên hệ thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <Toaster position="top-right" />
      <section className="contact-hero">
        <span>Liên hệ</span>

        <h1>Liên hệ với Phương Anh Rope</h1>

        <p>
          Chúng tôi hỗ trợ tư vấn sản phẩm, báo giá và nhận đơn hàng
          nhanh chóng trên toàn quốc.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-left">
          <div className="contact-info-card">
            <h2>Thông tin liên hệ</h2>

            <div className="contact-info-list">
              <div>
                <Phone size={20} />
                <div>
                  <strong>Hotline</strong>
                  <span>0901 234 567</span>
                </div>
              </div>

              <div>
                <Mail size={20} />
                <div>
                  <strong>Email</strong>
                  <span>contact@phuonganhrope.vn</span>
                </div>
              </div>

              <div>
                <MapPin size={20} />
                <div>
                  <strong>Địa chỉ</strong>
                  <span>Khu công nghiệp Phương Anh, tỉnh ven biển</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <h2>Gửi yêu cầu</h2>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                />
                {errors.full_name && <p className="contact-error">{errors.full_name}</p>}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="contact-error">{errors.email}</p>}
              </div>

              <div className="input-group">
                <textarea
                  rows="5"
                  placeholder="Nội dung liên hệ..."
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
                {errors.message && <p className="contact-error">{errors.message}</p>}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
                {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>

        <div className="contact-map-card">
          <div className="map-header">
            <MessageSquare size={20} />
            <h2>Vị trí cửa hàng</h2>
          </div>

          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=10.823098,106.629722&z=15&output=embed"
          />
        </div>
      </section>

      {successModal && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>

            <h3>Gửi thành công</h3>

            <p>
              Cảm ơn bạn đã liên hệ với Phương Anh Rope.
              Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>

            <button onClick={() => setSuccessModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}