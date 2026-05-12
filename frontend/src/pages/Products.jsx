import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import { fetchProducts } from '../services/productService'
<<<<<<< HEAD

const categories = ['Dây neo tàu', 'Dây thừng PP', 'Dây PE', 'Dây dù', 'Lưới đánh cá']
=======
import { LayoutGrid, Loader2, ChevronLeft, ChevronRight, SearchX } from 'lucide-react'

const categories = ['Dây neo tàu', 'Dây PP', 'Dây PE', 'Dây dù', 'Lưới đánh cá']
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)

export default function Products() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ category: '', size: '', price: '', search: '' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
<<<<<<< HEAD

  useEffect(() => {
    const loadProducts = async () => {
      const params = { ...filters, page, limit: 9 }
      const data = await fetchProducts(params)
      setProducts(data.items || [])
      setTotal(data.total || 0)
=======
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const params = { ...filters, page, limit: 12 }
        const data = await fetchProducts(params)
        setProducts(data.items || [])
        setTotal(data.total || 0)
      } finally { setLoading(false) }
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
    }
    loadProducts()
  }, [filters, page])

  const handleFilterChange = (field, value) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

<<<<<<< HEAD
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
=======
  const pages = useMemo(() => Math.max(1, Math.ceil(total / 12)), [total])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8 md:space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Sản phẩm</h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">Chất lượng bền bỉ - Niềm tin của mọi chuyến khơi xa</p>
      </div>

      <div className="sticky top-16 z-30 py-2 bg-slate-50/80 backdrop-blur-md">
        <FilterBar categories={categories} filters={filters} onChange={handleFilterChange} onSearch={(s) => handleFilterChange('search', s)} />
      </div>

      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40}/>
          <p className="text-slate-400 font-bold animate-pulse">Đang tìm sản phẩm...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
           <SearchX size={48} className="mx-auto text-slate-300"/>
           <p className="text-slate-500 font-bold">Không tìm thấy sản phẩm phù hợp</p>
           <button onClick={() => setFilters({category:'', size:'', price:'', search:''})} className="text-blue-600 font-bold underline">Xóa lọc dữ liệu</button>
        </div>
      )}

      {/* Pagination - Căn đều, dễ bấm trên mobile */}
      {pages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {total} Sản phẩm tổng cộng
          </p>
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-3xl border shadow-sm">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} 
              className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 transition-all">
              <ChevronLeft size={20}/>
            </button>
            <div className="px-5 text-sm font-black text-slate-700">Trang {page} / {pages}</div>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 transition-all">
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
