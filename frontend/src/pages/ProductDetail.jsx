import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addItem } from '../services/cartService'
import Gallery from '../components/Gallery'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProductById(id).then(setProduct)
  }, [id])

  const handleAddToCart = () => {
    addItem(product, quantity)
    navigate('/cart')
  }

  if (!product) return <div className="p-8 text-center">Đang tải sản phẩm...</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Gallery images={product.images} />
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-900">{product.category}</p>
            <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
            <p className="text-brand-900 text-2xl font-bold">{product.price > 0 ? `${product.price.toLocaleString()} đ` : 'Liên hệ'}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4"><span className="text-sm text-slate-600">Đường kính</span><p className="mt-2 font-semibold">{product.size}</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><span className="text-sm text-slate-600">Chất liệu</span><p className="mt-2 font-semibold">{product.material}</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><span className="text-sm text-slate-600">Tải trọng</span><p className="mt-2 font-semibold">{product.load || 'N/A'}</p></div>
            <div className="rounded-3xl bg-slate-50 p-4"><span className="text-sm text-slate-600">Tồn kho</span><p className="mt-2 font-semibold">{product.stock}</p></div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
              <p className="mt-2 text-slate-600">{product.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-700">Số lượng:</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-24 rounded-2xl border border-slate-300 px-4 py-2 text-sm" />
            </div>
            <button onClick={handleAddToCart} className="w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white shadow-lg">Thêm giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  )
}
