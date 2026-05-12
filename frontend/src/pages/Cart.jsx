import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { getCart, removeItem, updateItem, clearCart } from '../services/cartService'
<<<<<<< HEAD
=======
import { ShoppingBag, ArrowLeft, CreditCard, Trash2, Heart } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)

export default function Cart() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

<<<<<<< HEAD
  useEffect(() => {
    setItems(getCart())
  }, [])
=======
  useEffect(() => { setItems(getCart()) }, [])
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)

  const handleUpdate = (productId, quantity) => {
    setItems(updateItem(productId, quantity))
  }

  const handleRemove = (productId) => {
    setItems(removeItem(productId))
<<<<<<< HEAD
=======
    toast.success("Đã xóa sản phẩm")
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
<<<<<<< HEAD
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Giỏ hàng của bạn</h1>
        <p className="text-slate-600">Kiểm tra sản phẩm, thay đổi số lượng hoặc xóa mặt hàng trước khi thanh toán.</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-700">Giỏ hàng trống.</p>
          <Link to="/products" className="mt-4 inline-block rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Mua ngay</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-4">
=======
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 min-h-screen space-y-8">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShoppingBag size={20}/>
          </div>
          Giỏ hàng
        </h1>
        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{items.length} món</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-16 md:p-24 text-center shadow-xl shadow-slate-200/50 space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-5xl">🛒</div>
          <div className="space-y-2">
            <p className="text-slate-800 font-black text-2xl uppercase">Giỏ hàng rỗng</p>
            <p className="text-slate-400 font-medium">Hàng trăm mẫu dây thừng đang chờ bạn khám phá</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
            MUA SẮM NGAY <ArrowLeft className="rotate-180" size={18}/>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          {/* List items */}
          <div className="space-y-3">
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
            {items.map((item) => (
              <CartItem key={item.productId} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
            ))}
          </div>
<<<<<<< HEAD
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Tổng tiền</h2>
            <p className="mt-4 text-4xl font-bold text-brand-900">{totalPrice.toLocaleString()} đ</p>
            <button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Đặt hàng</button>
            <button onClick={() => { clearCart(); setItems([]) }} className="mt-3 w-full rounded-3xl border border-slate-300 px-6 py-3 text-sm text-slate-700">Xóa giỏ hàng</button>
=======

          {/* Checkout Card - Sticky on Desktop */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Hóa đơn tạm tính</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Số lượng:</span>
                  <span>{items.reduce((s,i) => s + i.quantity, 0)} sản phẩm</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-emerald-600">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex flex-col gap-1">
                  <span className="text-xs font-black text-slate-400 uppercase">Tổng cộng:</span>
                  <span className="text-4xl font-black text-blue-600 tracking-tighter">{totalPrice.toLocaleString()}₫</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} 
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95">
                ĐẶT HÀNG NGAY <CreditCard size={18}/>
              </button>

              <button onClick={() => { if(window.confirm('Xóa sạch giỏ hàng?')){ clearCart(); setItems([]); } }} 
                className="w-full mt-4 text-red-400 font-bold flex items-center justify-center gap-2 p-3 hover:text-red-500 rounded-2xl transition-all text-xs">
                <Trash2 size={14}/> Xóa giỏ hàng
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                  <Heart size={18} fill="currentColor"/>
               </div>
               <p className="text-[11px] text-blue-700 font-bold leading-tight uppercase tracking-wider">
                  Cảm ơn bạn đã tin tưởng Phương Anh Rope
               </p>
            </div>
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
          </div>
        </div>
      )}
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
