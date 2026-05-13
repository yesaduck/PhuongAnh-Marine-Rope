import { useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import toast, { Toaster } from 'react-hot-toast'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from '../services/productService'
import './AdminProducts.css'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:5002'
const ITEMS_PER_PAGE = 10

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  size: '',
  material: '',
  stock: '',
  images: [],
  imageFiles: [],
  imagePreviews: []
}

const categories = [
  'Dây thừng',
  'Dây neo',
  'Dây lưới',
  'Dây dù',
  'Dây PP',
  'Dây PE',
  'Phụ kiện ngư nghiệp',
  'Khác'
]

function normalizeImages(images) {
  if (!images) return []

  if (Array.isArray(images)) return images

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function getImageUrl(src) {
  if (!src) return ''
  if (src.startsWith('blob:')) return src
  if (src.startsWith('http')) return src
  return `${API_ORIGIN}${src}`
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const imageInputRef = useRef(null)
  const excelInputRef = useRef(null)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, stockFilter])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.toLowerCase().trim()
      const name = product.name?.toLowerCase() || ''
      const category = product.category?.toLowerCase() || ''
      const material = product.material?.toLowerCase() || ''

      const matchSearch =
        !keyword ||
        name.includes(keyword) ||
        category.includes(keyword) ||
        material.includes(keyword)

      const matchCategory =
        !categoryFilter || product.category === categoryFilter

      const stock = Number(product.stock || 0)
      const matchStock =
        !stockFilter ||
        (stockFilter === 'in-stock' && stock > 0) ||
        (stockFilter === 'out-stock' && stock <= 0)

      return matchSearch && matchCategory && matchStock
    })
  }, [products, search, categoryFilter, stockFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const allFilteredIds = filteredProducts.map((item) => item.id)
  const selectedAllFiltered =
    allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id))

  async function loadProducts() {
    try {
      setLoading(true)
      const data = await fetchProducts({ limit: 999 })
      const list = data.items || data || []

      setProducts(
        list.map((item) => ({
          ...item,
          images: normalizeImages(item.images)
        }))
      )
    } catch {
      toast.error('Không thể tải danh sách sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price ?? '',
      size: product.size || '',
      material: product.material || '',
      stock: product.stock ?? '',
      images: normalizeImages(product.images),
      imageFiles: [],
      imagePreviews: []
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))

    setFormErrors((prev) => ({
      ...prev,
      [field]: ''
    }))
  }

  function validateForm() {
    const errors = {}

    if (!form.name.trim()) {
      errors.name = 'Chưa nhập tên sản phẩm kìa. Nhập tên để khách còn biết đang mua gì.'
    }

    if (!form.category.trim()) {
      errors.category = 'Chưa chọn danh mục. Sản phẩm phải có nhóm để dễ lọc.'
    }

    if (form.price === '' || Number(form.price) <= 0) {
      errors.price = 'Giá bán chưa hợp lệ. Không thể để trống hoặc bằng 0.'
    }

    if (form.stock === '' || Number(form.stock) < 0) {
      errors.stock = 'Tồn kho sai rồi. Nhập số lượng từ 0 trở lên.'
    }

    if (!form.size.trim()) {
      errors.size = 'Chưa nhập kích thước. Ví dụ: 8mm, 10mm, 100m/cuộn.'
    }

    if (!form.material.trim()) {
      errors.material = 'Chưa nhập chất liệu. Ví dụ: PP, PE, Nylon.'
    }

    setFormErrors(errors)

    const firstError = Object.values(errors)[0]
    if (firstError) toast.error(firstError)

    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price || 1),
      stock: Number(form.stock || 0),
      size: form.size.trim(),
      material: form.material.trim(),
      images: form.images || [],
      imageFiles: form.imageFiles || []
    }

    try {
      setLoading(true)

      if (editingId) {
        await updateProduct(editingId, payload)
        toast.success('Cập nhật sản phẩm thành công.')
      } else {
        await createProduct(payload)
        toast.success('Thêm sản phẩm thành công.')
      }

      closeModal()
      await loadProducts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lưu sản phẩm thất bại.')
    } finally {
      setLoading(false)
    }
  }

  function handleUpload(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const previews = files.map((file) => URL.createObjectURL(file))

    setForm((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...previews]
    }))
  }

  function removeOldImage(index) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  function removeNewImage(index) {
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }))
  }

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleSelectAllFiltered() {
    if (selectedAllFiltered) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  async function confirmDeleteProducts() {
    const ids = confirmDelete?.ids || []
    if (!ids.length) return

    try {
      setLoading(true)

      for (const id of ids) {
        await deleteProduct(id)
      }

      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
      toast.success(`Đã xóa ${ids.length} sản phẩm.`)
      setConfirmDelete(null)
      await loadProducts()
    } catch {
      toast.error('Xóa sản phẩm thất bại. Có thể sản phẩm đang thuộc đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  function exportExcel() {
    const rows = filteredProducts.map((item) => ({
      name: item.name,
      category: item.category,
      price: item.price,
      size: item.size,
      material: item.material,
      stock: item.stock,
      description: item.description,
      images: normalizeImages(item.images).join(',')
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SanPham')
    XLSX.writeFile(workbook, 'san-pham-phuong-anh-rope.xlsx')
  }

  async function importExcel(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

      let success = 0
      let failed = 0

      for (const row of rows) {
        const payload = {
          name: row.name || row['Tên sản phẩm'] || '',
          category: row.category || row['Danh mục'] || 'Khác',
          price: Number(row.price || row['Giá bán'] || 1),
          size: row.size || row['Kích thước'] || '',
          material: row.material || row['Chất liệu'] || '',
          stock: Number(row.stock || row['Tồn kho'] || 0),
          description: row.description || row['Mô tả'] || '',
          images: String(row.images || row['Hình ảnh'] || '')
            .split(',')
            .map((url) => url.trim())
            .filter(Boolean),
          imageFiles: []
        }

        if (!payload.name) {
          failed++
          continue
        }

        try {
          await createProduct(payload)
          success++
        } catch {
          failed++
        }
      }

      toast.success(`Import xong: ${success} thành công, ${failed} lỗi.`)
      await loadProducts()
    } catch {
      toast.error('Import Excel thất bại. Kiểm tra lại định dạng file.')
    } finally {
      setLoading(false)
      if (excelInputRef.current) excelInputRef.current.value = ''
    }
  }

  function getPageNumbers() {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="admin-products-page">
      <Toaster position="top-right" />
      <section className="admin-products-hero">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Thêm, chỉnh sửa, xóa, import và export sản phẩm dây ngư nghiệp.</p>
        </div>

        <div className="admin-products-actions">
          <button type="button" className="primary-btn" onClick={openCreateModal}>
            + Thêm sản phẩm
          </button>

          <button type="button" className="secondary-btn" onClick={() => excelInputRef.current?.click()}>
            Import Excel
          </button>

          <button type="button" className="secondary-btn" onClick={exportExcel}>
            Export Excel
          </button>

          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={importExcel}
          />
        </div>
      </section>

      <section className="product-list-card">
        <div className="list-header">
          <div>
            <h2>Danh sách sản phẩm</h2>
            <p>
              {filteredProducts.length} sản phẩm phù hợp • Trang {currentPage}/{totalPages}
            </p>
          </div>

          <button
            type="button"
            className="danger-soft-btn"
            disabled={!selectedIds.length}
            onClick={() => setConfirmDelete({ ids: selectedIds })}
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
        </div>

        <div className="filter-bar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, danh mục, chất liệu..."
          />

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="">Tất cả tồn kho</option>
            <option value="in-stock">Còn hàng</option>
            <option value="out-stock">Hết hàng</option>
          </select>
        </div>

        <div className="product-table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedAllFiltered}
                    onChange={toggleSelectAllFiltered}
                  />
                </th>
                <th>Ảnh</th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((product) => {
                const firstImage = normalizeImages(product.images)[0]

                return (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>

                    <td>
                      {firstImage ? (
                        <img
                          className="table-img"
                          src={getImageUrl(firstImage)}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}

                      <div
                        className="empty-img"
                        style={{ display: firstImage ? 'none' : 'flex' }}
                      >
                        No image
                      </div>
                    </td>

                    <td>
                      <strong>{product.name}</strong>
                      <span>
                        {product.size || 'Chưa có size'} • {product.material || 'Chưa có chất liệu'}
                      </span>
                    </td>

                    <td>{product.category}</td>
                    <td>{Number(product.price || 0).toLocaleString('vi-VN')} đ</td>
                    <td>{product.stock}</td>

                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => openEditModal(product)}>
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => setConfirmDelete({ ids: [product.id] })}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {!loading && currentProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
            Đầu
          </button>

          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            Trước
          </button>

          {currentPage > 3 && <span>...</span>}

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && <span>...</span>}

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
            Sau
          </button>

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
            Cuối
          </button>
        </div>
      </section>

      {modalOpen && (
        <div className="product-modal-overlay">
          <form onSubmit={handleSubmit} className="product-modal">
            <div className="modal-header">
              <div>
                <h2>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
                <p>Khung thao tác nhanh, dễ dùng trên PC và mobile.</p>
              </div>

              <button type="button" className="close-modal-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="form-grid">
              <label className={formErrors.name ? 'field-error' : ''}>
                Tên sản phẩm <span>*</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ví dụ: Dây PP xanh 8mm"
                />
                {formErrors.name && <small>{formErrors.name}</small>}
              </label>

              <label className={formErrors.category ? 'field-error' : ''}>
                Danh mục <span>*</span>
                <select
                  required
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className={formErrors.price ? 'field-error' : ''}>
                Giá bán
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
                {formErrors.price && <small>{formErrors.price}</small>}
              </label>

              <label className={formErrors.stock ? 'field-error' : ''}>
                Tồn kho
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                />
                {formErrors.stock && <small>{formErrors.stock}</small>}
              </label>

              <label className={formErrors.size ? 'field-error' : ''}>
                Kích thước
                <input
                  value={form.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                />
                {formErrors.size && <small>{formErrors.size}</small>}
              </label>

              <label className={formErrors.material ? 'field-error' : ''}>
                Chất liệu
                <input
                  value={form.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                />
                {formErrors.material && <small>{formErrors.material}</small>}
              </label>

              <label className="full">
                Mô tả
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </label>

              <div className="full image-upload-box">
                <label>
                  Hình ảnh
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                  />
                </label>

                {(form.images.length > 0 || form.imagePreviews.length > 0) && (
                  <div className="image-preview-list">
                    {form.images.map((src, index) => (
                      <div className="image-preview-item" key={`old-${src}-${index}`}>
                        <img src={getImageUrl(src)} alt="" />
                        <button type="button" onClick={() => removeOldImage(index)}>
                          Xóa
                        </button>
                      </div>
                    ))}

                    {form.imagePreviews.map((src, index) => (
                      <div className="image-preview-item" key={`new-${src}-${index}`}>
                        <img src={src} alt="" />
                        <button type="button" onClick={() => removeNewImage(index)}>
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={closeModal}>
                Hủy
              </button>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc muốn xóa {confirmDelete.ids.length} sản phẩm? Thao tác này không thể hoàn tác.
            </p>

            <div className="confirm-actions">
              <button type="button" className="secondary-btn" onClick={() => setConfirmDelete(null)}>
                Hủy
              </button>

              <button type="button" className="danger-btn" onClick={confirmDeleteProducts}>
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}