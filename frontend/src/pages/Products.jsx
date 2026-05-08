import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import { fetchProducts } from '../services/productService'

const categories = ['Dây neo tàu', 'Dây thừng PP', 'Dây PE', 'Dây dù', 'Lưới đánh cá']

export default function Products() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ category: '', size: '', price: '', search: '' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      const params = { ...filters, page, limit: 9 }
      const data = await fetchProducts(params)
      setProducts(data.items || [])
      setTotal(data.total || 0)
    }
    loadProducts()
  }, [filters, page])

  const handleFilterChange = (field, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const pages = useMemo(() => Math.max(1, Math.ceil(total / 9)), [total])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Danh sách sản phẩm</h1>
        <p className="text-slate-600">Chọn dây phù hợp theo loại, kích thước, giá hoặc tìm kiếm nhanh.</p>
      </div>

      <FilterBar categories={categories} filters={filters} onChange={handleFilterChange} onSearch={(search) => handleFilterChange('search', search)} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Hiển thị {products.length} trên {total} sản phẩm</p>
        <div className="flex items-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Trước</button>
          <span className="text-sm text-slate-600">{page}/{pages}</span>
          <button disabled={page >= pages} onClick={() => setPage((prev) => Math.min(pages, prev + 1))} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>
  )
}
