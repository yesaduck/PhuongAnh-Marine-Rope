import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import { fetchProducts } from '../services/productService'
import './Products.css'

const categories = [
  'Dây neo tàu',
  'Dây thừng PP',
  'Dây PE',
  'Dây dù',
  'Lưới đánh cá'
]

const LIMIT = 9

export default function Products() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    price: '',
    search: ''
  })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [filters, page])

  const pages = useMemo(() => {
    return Math.max(1, Math.ceil(total / LIMIT))
  }, [total])

  const loadProducts = async () => {
    try {
      setLoading(true)

      const params = {
        ...filters,
        page,
        limit: LIMIT
      }

      const data = await fetchProducts(params)

      setProducts(data.items || data || [])
      setTotal(data.total || (data.items ? data.items.length : data.length || 0))
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setPage(1)
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const resetFilters = () => {
    setPage(1)
    setFilters({
      category: '',
      size: '',
      price: '',
      search: ''
    })
  }

  return (
    <div className="products-page">
      <section className="products-hero">
        <div>
          <span>Sản phẩm</span>
          <h1>Danh sách sản phẩm</h1>
          <p>
            Chọn dây phù hợp theo loại, kích thước, giá hoặc tìm kiếm nhanh.
          </p>
        </div>

        <button type="button" onClick={resetFilters}>
          Xóa bộ lọc
        </button>
      </section>

      <section className="products-filter-card">
        <FilterBar
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onSearch={(search) => handleFilterChange('search', search)}
        />
      </section>

      <section className="products-result-header">
        <div>
          <h2>Sản phẩm phù hợp</h2>
          <p>
            Hiển thị {products.length} trên {total} sản phẩm
          </p>
        </div>

        <span>
          Trang {page}/{pages}
        </span>
      </section>

      {loading ? (
        <div className="products-loading">
          Đang tải sản phẩm...
        </div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="products-empty">
          Không tìm thấy sản phẩm phù hợp. Hãy thử đổi bộ lọc khác.
        </div>
      )}

      <div className="products-pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage(1)}
        >
          Đầu
        </button>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Trước
        </button>

        <span>
          {page}/{pages}
        </span>

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
        >
          Sau
        </button>

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => setPage(pages)}
        >
          Cuối
        </button>
      </div>
    </div>
  )
}