import { useEffect, useState } from 'react'
import { createProduct, deleteProduct, fetchProducts, updateProduct, uploadImage } from '../services/productService'

const emptyForm = { name: '', description: '', category: '', price: 0, size: '', material: '', stock: 0, images: [] }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await fetchProducts({ limit: 100 })
    setProducts(data.items || data)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (editingId) {
      await updateProduct(editingId, form)
      setMessage('Cập nhật sản phẩm thành công.')
    } else {
      await createProduct(form)
      setMessage('Thêm sản phẩm mới thành công.')
    }
    setForm(emptyForm)
    setEditingId(null)
    loadProducts()
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      size: product.size,
      material: product.material,
      stock: product.stock,
      images: product.images || []
    })
  }

  const handleDelete = async (id) => {
    await deleteProduct(id)
    loadProducts()
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const data = await uploadImage(file)
    setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Quản lý sản phẩm</h1>
        <p className="mt-2 text-slate-600">Thêm, chỉnh sửa hoặc xóa sản phẩm dây ngư nghiệp.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        {message && <div className="col-span-full rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
        <label className="space-y-2">
          Tên sản phẩm
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2">
          Danh mục
          <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2">
          Giá bán
          <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2">
          Kích thước
          <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2">
          Chất liệu
          <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2">
          Tồn kho
          <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 col-span-full">
          Mô tả sản phẩm
          <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none" />
        </label>
        <label className="space-y-2 col-span-full">
          Hình ảnh
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" />
          <div className="mt-3 flex flex-wrap gap-3">{form.images.map((src, index) => (<img key={index} src={src} alt={index} className="h-20 w-20 rounded-2xl object-cover" />))}</div>
        </label>
        <button type="submit" className="col-span-full rounded-3xl bg-brand-900 px-6 py-3 text-sm font-semibold text-white">{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
      </form>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-600">{product.category} • {product.size} • {product.material}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleEdit(product)} className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-900">Sửa</button>
                <button onClick={() => handleDelete(product.id)} className="rounded-3xl bg-red-500 px-4 py-2 text-sm text-white">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
