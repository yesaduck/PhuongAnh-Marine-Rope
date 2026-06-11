import './About.css'
import { getImageUrl } from '../utils/imageHelpers'

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <span>Về chúng tôi</span>
          <h1>Xưởng sản xuất dây ngư nghiệp uy tín của Phương Anh</h1>
          <p>
            Chuyên cung cấp dây neo tàu, dây thừng, dây lưới và vật tư ngư nghiệp
            chất lượng cao cho ngư dân, đại lý và khách hàng sỉ trên toàn quốc.
          </p>
        </div>

        <div className="about-hero-image">
          <img
            src={('/images/about.PNG')}
            alt="Xưởng sản xuất dây ngư nghiệp"
          />
        </div>
      </section>

      <section className="about-stats">
        <div>
          <h2>10+</h2>
          <p>Năm hoạt động</p>
        </div>

        <div>
          <h2>50+</h2>
          <p>Sản phẩm dây và lưới</p>
        </div>

        <div>
          <h2>100%</h2>
          <p>Cam kết chất lượng</p>
        </div>

        <div>
          <h2>24/7</h2>
          <p>Hỗ trợ khách sỉ và ngư dân</p>
        </div>
      </section>

      <section className="about-quality">
        <div>
          <h2>Cam kết chất lượng</h2>
          <p>
            Mỗi sản phẩm được kiểm tra kỹ trước khi giao, đảm bảo độ bền,
            độ chịu tải và khả năng chống mài mòn phù hợp với môi trường biển.
          </p>
        </div>

        <ul>
          <li>Độ bền cao, dùng tốt trong môi trường nước mặn.</li>
          <li>Hỗ trợ tư vấn chọn dây theo nhu cầu thực tế.</li>
          <li>Giá tốt cho khách hàng sỉ, đại lý và xưởng.</li>
          <li>Giao hàng linh hoạt theo khu vực.</li>
        </ul>
      </section>
    </div>
  )
}