<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import * as XLSX from 'xlsx'
import {
  Search, FileDown, FileUp, Trash2, Edit3, X, Save,
  RefreshCw, CheckSquare, Square, ChevronLeft, ChevronRight,
  ImagePlus, LayoutGrid, List, ChevronsLeft, ChevronsRight,
  SlidersHorizontal, XCircle
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const CATEGORIES = ['Dây neo tàu', 'Dây PP', 'Dây PE', 'Dây dù', 'Lưới', 'Phao', 'Khác']
const EMPTY_FORM = { name: '', price: '', stock: '', category: '', material: '', size: '', description: '', imageUrl: '' }
const PAGE_SIZE = 10

// ── Product image ──────────────────────────────────────────────────────────
function ProductImage({ src, name, className = 'w-12 h-12' }) {
  const [err, setErr] = useState(false)
  return (
    <div className={`${className} rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center`}>
      {src && !err
        ? <img src={src} alt={name} onError={() => setErr(true)} className="w-full h-full object-cover object-center" />
        : <span className="text-2xl">📦</span>
      }
    </div>
  )
}

// ── Edit / Add Modal ───────────────────────────────────────────────────────
function EditModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...product })
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '')
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const imageInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setForm(f => ({ ...f, imageUrl: ev.target.result }))
      setImageFile(file)
    }
    reader.readAsDataURL(file); e.target.value = null
  }

  const clearImage = () => { setImagePreview(''); setForm(f => ({ ...f, imageUrl: '' })); setImageFile(null) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      // If a new image file was selected, send as multipart FormData
      let payload = form
      if (imageFile) {
        const fd = new FormData()
        fd.append('name', form.name)
        fd.append('category', form.category)
        fd.append('price', form.price)
        fd.append('stock', form.stock)
        fd.append('material', form.material)
        fd.append('size', form.size)
        fd.append('description', form.description)
        fd.append('images', imageFile)
        payload = fd
      }

      if (product?.id) await updateProduct(product.id, payload)
      else await createProduct(payload)
      toast.success(product?.id ? 'Đã cập nhật!' : 'Đã thêm sản phẩm!')
      onSaved()
    } catch (err) { toast.error(err.response?.data?.error || 'Lỗi dữ liệu!') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(5px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden"
        style={{ animation: 'modalIn .18s cubic-bezier(.4,0,.2,1)' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <span className="font-black text-slate-800 text-lg flex items-center gap-2">
            {product?.id
              ? <><Edit3 size={18} className="text-blue-500" /> Chỉnh sửa sản phẩm</>
              : <><span>➕</span> Thêm sản phẩm mới</>}
          </span>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Image + Name + Category */}
          <div className="flex gap-5 items-start">
            {/* Image upload */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <div onClick={() => imageInputRef.current.click()}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 cursor-pointer flex items-center justify-center bg-slate-50 hover:bg-blue-50/40 transition overflow-hidden relative group">
                {imagePreview
                  ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover object-center" />
                  : <div className="flex flex-col items-center gap-1.5 text-slate-300 group-hover:text-blue-400 transition">
                      <ImagePlus size={26} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">Tải ảnh</span>
                    </div>
                }
              </div>
              {imagePreview ? (
                <button type="button" onClick={clearImage}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition border border-transparent hover:border-red-100">
                  <XCircle size={12} /> Xóa ảnh
                </button>
              ) : (
                <span className="text-[10px] text-slate-300 font-medium">Click để chọn</span>
              )}
            </div>

            {/* Name + category */}
            <div className="flex-1 grid gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">Tên sản phẩm *</label>
                <input required className="w-full p-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-300 border-none font-medium text-slate-800"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên sản phẩm..." />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">Danh mục</label>
                <select className="w-full p-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-300 border-none text-slate-700"
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Chọn danh mục</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Other fields */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Giá (₫)', key: 'price', type: 'number', placeholder: '0' },
              { label: 'Tồn kho', key: 'stock', type: 'number', placeholder: '0' },
              { label: 'Chất liệu', key: 'material', placeholder: 'PP, PE, Nylon...' },
              { label: 'Kích thước', key: 'size', placeholder: '10mm, 12mm...' },
            ].map(({ label, key, type = 'text', placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">{label}</label>
                <input type={type} className="w-full p-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-300 border-none"
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">Mô tả</label>
              <input className="w-full p-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-300 border-none"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả ngắn..." />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-60">
              <Save size={17} /> {saving ? 'Đang lưu...' : (product?.id ? 'Lưu thay đổi' : 'Thêm sản phẩm')}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition">
              Hủy
            </button>
          </div>
        </form>
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
      </div>
    </div>
  )
}
<<<<<<< HEAD
=======

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStock, setFilterStock] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalProduct, setModalProduct] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const fileInputRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      const items = Array.isArray(data) ? data : data.items || []
      // normalize images => imageUrl (first image) for UI
      const normalized = items.map(p => {
        let imageUrl = ''
        try {
          if (p.imageUrl) imageUrl = p.imageUrl
          else if (p.images) {
            const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images
            if (Array.isArray(imgs) && imgs.length > 0) imageUrl = imgs[0]
          }
        } catch (e) { imageUrl = '' }
        return { ...p, imageUrl }
      })
      setProducts(normalized)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, filterCategory, filterStock])

  const handleImportExcel = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' })
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        toast.loading(`Đang xử lý ${data.length} dòng...`, { id: 'import' })
        for (const item of data) {
          const payload = {
            name: String(item['Tên sản phẩm'] || item['name'] || '').trim(),
            category: String(item['Danh mục'] || item['category'] || 'Khác'),
            price: Number(item['Giá'] || item['price'] || 0),
            stock: Number(item['Kho'] || item['stock'] || 0),
            material: String(item['Chất liệu'] || item['material'] || ''),
            size: String(item['Kích thước'] || item['size'] || ''),
            imageUrl: String(item['Ảnh'] || item['imageUrl'] || ''),
          }
          if (payload.name) await createProduct(payload)
        }
        toast.success('Nhập Excel thành công!', { id: 'import' }); load()
      } catch { toast.error('Lỗi file Excel!') }
    }
    reader.readAsBinaryString(file); e.target.value = null
  }

  const handleExportExcel = () => {
    const rows = filtered.map(p => ({
      'Tên sản phẩm': p.name, 'Danh mục': p.category, 'Giá': p.price,
      'Kho': p.stock, 'Chất liệu': p.material || '', 'Kích thước': p.size || '', 'Mô tả': p.description || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm')
    XLSX.writeFile(wb, `san-pham-${Date.now()}.xlsx`)
    toast.success('Đã xuất Excel!')
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Xóa vĩnh viễn ${selectedIds.length} mục?`)) return
    try {
      setLoading(true)
      await Promise.all(selectedIds.map(id => deleteProduct(id)))
      toast.success('Đã xóa hàng loạt!'); setSelectedIds([]); load()
    } catch { toast.error('Có lỗi khi xóa!') }
    finally { setLoading(false) }
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !search || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    const matchCat = !filterCategory || p.category === filterCategory
    const matchStock = !filterStock || (filterStock === 'low' ? p.stock < 10 : p.stock >= 10)
    return matchSearch && matchCat && matchStock
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilters = search || filterCategory || filterStock
  const clearFilters = () => { setSearch(''); setFilterCategory(''); setFilterStock('') }

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [page - 2, page - 1, page, page + 1, page + 2]
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto bg-slate-50/30 min-h-screen">
      <Toaster position="top-right" />

      {modalProduct !== null && (
        <EditModal product={modalProduct} onClose={() => setModalProduct(null)} onSaved={() => { setModalProduct(null); load() }} />
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-5 rounded-[2rem] border shadow-sm items-start lg:items-center">
        <h1 className="text-2xl font-black text-slate-800 whitespace-nowrap">📦 Kho hàng ({products.length})</h1>
        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-300 pointer-events-none" size={17} />
            <input type="text" placeholder="Tìm nhanh..." value={search}
              className="pl-9 pr-8 py-2 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-400 w-52 text-sm"
              onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-slate-300 hover:text-slate-500">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-2.5 text-slate-300 pointer-events-none" size={15} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-400 text-sm text-slate-600 cursor-pointer appearance-none">
              <option value="">Tất cả danh mục</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Stock filter */}
          <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
            className="px-3 py-2 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-400 text-sm text-slate-600 cursor-pointer appearance-none">
            <option value="">Tất cả tồn kho</option>
            <option value="low">⚠️ Sắp hết</option>
            <option value="ok">✅ Còn hàng</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 bg-amber-50 text-amber-600 rounded-2xl text-sm font-bold hover:bg-amber-100 transition">
              <XCircle size={14} /> Xóa lọc
            </button>
          )}

          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-xl transition ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={16} /></button>
          </div>

          <button onClick={load} className="p-2.5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition" title="Tải lại">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button onClick={() => setModalProduct({})}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-2xl font-bold hover:bg-slate-700 active:scale-95 transition text-sm shadow-lg shadow-slate-200">
            ➕ Thêm mới
          </button>

          <input type="file" ref={fileInputRef} onChange={handleImportExcel} className="hidden" accept=".xlsx,.xls" />
          <button onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition text-sm">
            <FileUp size={15} /> Nhập Excel
          </button>

          <button onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 active:scale-95 transition text-sm">
            <FileDown size={15} /> Xuất Excel
          </button>

          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-red-200 transition text-sm">
              <Trash2 size={15} /> Xóa ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-[2.5rem] border shadow-xl shadow-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b">
                  <th className="p-5 w-12 text-center">
                    <button onClick={() => setSelectedIds(selectedIds.length === paginated.length && paginated.length > 0 ? [] : paginated.map(p => p.id))}>
                      {selectedIds.length === paginated.length && paginated.length > 0
                        ? <CheckSquare size={20} className="text-blue-600" />
                        : <Square size={20} className="text-slate-300" />}
                    </button>
                  </th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Kích thước</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Đơn giá</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Kho</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && <tr><td colSpan={6} className="p-10 text-center text-slate-400">Đang tải...</td></tr>}
                {!loading && paginated.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-slate-400">Không tìm thấy sản phẩm nào</td></tr>}
                {paginated.map(p => (
                  <tr key={p.id} className={`hover:bg-blue-50/20 transition-all ${selectedIds.includes(p.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-5 text-center">
                      <button onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}>
                        {selectedIds.includes(p.id) ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} className="text-slate-300" />}
                      </button>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <ProductImage src={p.imageUrl} name={p.name} className="w-12 h-12" />
                        <div>
                          <div className="font-bold text-slate-800 text-base leading-tight">{p.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{p.category} • {p.material || 'N/A'}</div>
                          {p.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 text-sm hidden md:table-cell">{p.size || '—'}</td>
                    <td className="p-5 text-right font-black text-blue-600">{Number(p.price).toLocaleString()}₫</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {p.stock < 10 ? `⚠️ ${p.stock}` : p.stock}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setModalProduct(p)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={async () => { if (window.confirm('Xóa sản phẩm này?')) { await deleteProduct(p.id); load() } }}
                          className="p-2.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paginated.map(p => (
            <div key={p.id} className={`bg-white rounded-[1.5rem] border shadow-sm hover:shadow-lg transition-all overflow-hidden ${selectedIds.includes(p.id) ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="absolute inset-0 w-full h-full object-cover object-center" onError={e => { e.target.style.display = 'none' }} />
                  : <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
                }
                <button onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                  className="absolute top-2 left-2 bg-white/90 rounded-xl p-1 shadow">
                  {selectedIds.includes(p.id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-400" />}
                </button>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black ${p.stock < 10 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {p.stock < 10 ? `⚠️${p.stock}` : p.stock}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">{p.category}</div>
                <div className="font-bold text-slate-800 text-sm leading-tight truncate">{p.name}</div>
                <div className="font-black text-blue-600 text-sm mt-1">{Number(p.price).toLocaleString()}₫</div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setModalProduct(p)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1">
                    <Edit3 size={13} /> Sửa
                  </button>
                  <button onClick={async () => { if (window.confirm('Xóa?')) { await deleteProduct(p.id); load() } }}
                    className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1">
                    <Trash2 size={13} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && paginated.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-400">Không tìm thấy sản phẩm</div>
          )}
        </div>
      )}

      {/* ── PAGINATION ── */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-[2rem] border shadow-sm flex-wrap gap-3">
        <span className="text-sm text-slate-400 font-medium">
          Trang <span className="font-black text-slate-700">{page}</span> / {totalPages}
          <span className="mx-2 text-slate-200">•</span>
          <span className="text-slate-500">{filtered.length} sản phẩm</span>
          {filtered.length !== products.length && (
            <span className="ml-1 text-slate-400">(lọc từ {products.length})</span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          {/* First */}
          <button onClick={() => setPage(1)} disabled={page === 1}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition" title="Trang đầu">
            <ChevronsLeft size={16} />
          </button>
          {/* Prev */}
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition">
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map(pg => (
            <button key={pg} onClick={() => setPage(pg)}
              className={`w-10 h-10 rounded-2xl font-bold text-sm transition ${pg === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}>
              {pg}
            </button>
          ))}

          {/* Next */}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition">
            <ChevronRight size={16} />
          </button>
          {/* Last */}
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
            className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition" title="Trang cuối">
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
