export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
      <img src={item.image || '/images/no-image.png'} alt={item.name} className="h-32 w-full rounded-3xl object-cover md:w-40" />
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-slate-600">Kích thước: {item.size} • {item.material}</p>
        <p className="text-brand-900 font-semibold">{item.price.toLocaleString()} đ</p>
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => onUpdate(item.productId, item.quantity - 1)} className="rounded-full border border-slate-300 px-3 py-1">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdate(item.productId, item.quantity + 1)} className="rounded-full border border-slate-300 px-3 py-1">+</button>
          <button onClick={() => onRemove(item.productId)} className="ml-auto text-sm text-red-600">Xóa</button>
        </div>
      </div>
    </div>
  )
}
