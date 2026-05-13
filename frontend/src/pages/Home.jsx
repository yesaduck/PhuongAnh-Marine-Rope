import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Anchor, ShieldCheck, Truck, Waves } from 'lucide-react'
import { fetchProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import './Home.css'

const highlightCategories = [
  'Dây neo tàu',
  'Dây thừng PP',
  'Dây PE',
  'Dây dù',
  'Lưới đánh cá'
]

const benefits = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Bền chắc',
    desc: 'Phù hợp môi trường biển, chịu lực tốt.'
  },
  {
    icon: <Anchor size={22} />,
    title: 'Đúng nhu cầu',
    desc: 'Tư vấn loại dây theo tàu, lưới và công việc.'
  },
  {
    icon: <Truck size={22} />,
    title: 'Giao nhanh',
    desc: 'Hỗ trợ giao hàng cho khách sỉ và ngư dân.'
  }
]

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ limit: 5 }).then((data) => {
      setProducts(data.items || data || [])
    })
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <span className="home-eyebrow">
              Xưởng dây ngư nghiệp Phương Anh
            </span>

            <h1>
              Chuyên cung cấp dây ngư nghiệp chất lượng cao
            </h1>

            <p>
              Dây an toàn, bền bỉ, phù hợp cho đánh bắt, neo đậu tàu thuyền,
              nhà máy, đại lý và khách hàng sỉ.
            </p>

            <div className="home-hero-actions">
              <Link to="/products" className="home-primary-btn">
                Xem sản phẩm
              </Link>

              <Link to="/contact" className="home-outline-btn">
                Liên hệ báo giá
              </Link>
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src="https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80"
              alt="Banner dây ngư nghiệp"
            />

            <div className="home-floating-card">
              <Waves size={22} />
              <div>
                <strong>Dây ngư nghiệp bền bỉ</strong>
                <span>Chống mài mòn, chịu tải tốt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        {benefits.map((item) => (
          <article key={item.title}>
            <div>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>Danh mục nổi bật</h2>
            <p>Lựa chọn loại dây phù hợp với yêu cầu sử dụng thực tế.</p>
          </div>
        </div>

        <div className="home-category-grid">
          {highlightCategories.map((item) => (
            <Link
              key={item}
              to={`/products?category=${encodeURIComponent(item)}`}
              className="home-category-card"
            >
              {item}
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>Sản phẩm nổi bật</h2>
            <p>Một số sản phẩm tiêu biểu cho ngư nghiệp và neo tàu.</p>
          </div>

          <Link to="/products" className="home-view-all">
            Xem tất cả
          </Link>
        </div>

        <div className="home-product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="home-empty-products">
              Chưa có sản phẩm nổi bật để hiển thị.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}