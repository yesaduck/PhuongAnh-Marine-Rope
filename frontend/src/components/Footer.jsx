import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Giới thiệu */}
          <div className="footer-column">
            <h2 className="footer-title">Phương Anh Rope</h2>
            <p className="footer-text">
              Chuyên cung cấp dây ngư nghiệp chất lượng cao.
            </p>
          </div>

          {/* Liên hệ */}
          <div className="footer-column">
            <h3 className="footer-heading">Liên hệ</h3>
            <p className="footer-text">
              Hotline: <strong>0901 234 567</strong>
            </p>
            <p className="footer-text">
              Email: <strong>contact@phuonganhrope.vn</strong>
            </p>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="footer-column">
            <h3 className="footer-heading">Hỗ trợ khách hàng</h3>
            <a href="/warranty-policy" className="footer-link">
              Chính sách bảo hành
            </a>
            <a href="/shipping-policy" className="footer-link">
              Chính sách giao hàng
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Phương Anh Rope. All rights reserved.
        </div>
      </div>
    </footer>
  )
}