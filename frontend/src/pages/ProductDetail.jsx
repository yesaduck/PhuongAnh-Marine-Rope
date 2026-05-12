import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addItem } from '../services/cartService'
import Gallery from '../components/Gallery'
<<<<<<< HEAD
=======
import toast, { Toaster } from 'react-hot-toast'
import { ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react'
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
<<<<<<< HEAD
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
=======
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getDetail = async () => {
      try {
        const data = await fetchProductById(id)
        // Parse images nếu nó là string JSON từ database
        if (data && typeof data.images === 'string') {
          data.images = JSON.parse(data.images)
        }
        setProduct(data)
      } catch (error) {
        toast.error("Không thể tải thông tin sản phẩm")
      } finally {
        setLoading(false)
      }
    }
    getDetail()
  }, [id])

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return toast.error("Sản phẩm đã hết hàng!")
    }
    if (quantity > product.stock) {
      return toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
    }
    
    addItem(product, quantity)
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`)
    // Bạn có thể chọn navigate ngay hoặc để khách ở lại mua tiếp
    // navigate('/cart') 
  }

  if (loading) return <div className="p-20 text-center font-medium text-slate-500 animate-pulse">Đang tải sản phẩm...</div>
  if (!product) return <div className="p-20 text-center text-red-500 font-bold">Sản phẩm không tồn tại!</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <Toaster position="top-center" />
      
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
      >
        <ChevronLeft size={18} /> Quay lại danh sách
      </button>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Bên trái: Hình ảnh */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
          <Gallery images={product.images} />
        </div>

        {/* Bên phải: Thông tin */}
        <div className="space-y-8 rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/40">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <p className="text-3xl font-black text-blue-600">
              {product.price > 0 ? `${Number(product.price).toLocaleString()} đ` : 'Liên hệ'}
            </p>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kích thước</span>
              <p className="mt-1 font-bold text-slate-700">{product.size || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chất liệu</span>
              <p className="mt-1 font-bold text-slate-700">{product.material || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tình trạng</span>
              <p className={`mt-1 font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Mô tả sản phẩm</h2>
              <p className="text-slate-500 leading-relaxed text-sm">{product.description || 'Thông tin đang được cập nhật...'}</p>
            </div>

            {/* Bộ chọn số lượng */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-700">Số lượng:</span>
              <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-white rounded-xl transition-all text-slate-600"
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                  className="w-12 bg-transparent text-center font-bold text-slate-800 outline-none" 
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-white rounded-xl transition-all text-slate-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Nút bấm */}
            <button 
              onClick={handleAddToCart} 
              disabled={product.stock <= 0}
              className={`w-full flex items-center justify-center gap-3 rounded-2xl py-4 font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                product.stock > 0 
                ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingCart size={20} />
              {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
            </button>
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
          </div>
        </div>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
