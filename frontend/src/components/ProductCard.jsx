import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
  const priceLabel = product.price > 0 ? `${product.price.toLocaleString()} đ` : 'Liên hệ'

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img src={imageUrl} alt={product.name} className="h-56 w-full object-cover" />
      </Link>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm text-slate-500">{product.category}</p>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        </div>
        <p className="text-sm text-slate-600">Kích thước: {product.size}</p>
        <p className="text-sm text-slate-600">Chất liệu: {product.material}</p>
        <div className="flex items-center justify-between">
          <span className="text-brand-900 font-semibold">{priceLabel}</span>
          <Link to={`/products/${product.id}`} className="rounded-full bg-brand-900 px-4 py-2 text-sm text-white">Mua ngay</Link>
        </div>
      </div>
    </article>
  )
}
