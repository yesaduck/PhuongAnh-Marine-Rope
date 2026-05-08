import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'

const highlightCategories = ['Dây neo tàu', 'Dây thừng PP', 'Dây PE', 'Dây dù', 'Lưới đánh cá']

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ limit: 5 }).then((data) => setProducts(data.items || []))
  }, [])

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Xưởng dây ngư nghiệp Phương Anh</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Chuyên cung cấp dây ngư nghiệp chất lượng cao</h1>
            <p className="max-w-xl text-slate-200">Dây an toàn, bền bỉ và phù hợp với nhu cầu đánh bắt, neo đậu tàu thuyền, nhà máy và thương mại.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/products" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 shadow-lg">Xem sản phẩm</Link>
              <a href="/contact" className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm text-white">Liên hệ báo giá</a>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <img src="https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80" alt="Banner dây ngư nghiệp" className="w-full rounded-[2rem] object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900">Danh mục nổi bật</h2>
          <p className="text-slate-600">Lựa chọn loại dây phù hợp với yêu cầu của bạn.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {highlightCategories.map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">{item}</div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Sản phẩm nổi bật</h2>
            <p className="text-slate-600">Một số sản phẩm tiêu biểu cho ngư nghiệp và neo tàu.</p>
          </div>
          <Link to="/products" className="text-brand-900 font-medium">Xem tất cả</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
