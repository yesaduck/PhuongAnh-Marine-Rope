import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { getCart, removeItem, updateItem, clearCart } from '../services/cartService'

export default function Cart() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setItems(getCart())
  }, [])

  const handleUpdate = (productId, quantity) => {
    setItems(updateItem(productId, quantity))
  }

  const handleRemove = (productId) => {
    setItems(removeItem(productId))
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
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
            {items.map((item) => (
              <CartItem key={item.productId} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
            ))}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Tổng tiền</h2>
            <p className="mt-4 text-4xl font-bold text-brand-900">{totalPrice.toLocaleString()} đ</p>
            <button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">Đặt hàng</button>
            <button onClick={() => { clearCart(); setItems([]) }} className="mt-3 w-full rounded-3xl border border-slate-300 px-6 py-3 text-sm text-slate-700">Xóa giỏ hàng</button>
          </div>
        </div>
      )}
    </div>
  )
}
