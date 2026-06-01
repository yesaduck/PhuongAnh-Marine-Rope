import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  Layers,
  Ruler,
  Package,
  Plus,
  Trash2,
  Search,
  X
} from 'lucide-react'
import api from '../services/api'
import './AdminProductAttributes.css'

const TYPES = [
  {
    value: 'category',
    label: 'Danh mục',
    icon: <Layers size={18} />,
    placeholder: 'Ví dụ: Dây PP, Dây PE, Lưới đánh cá'
  },
  {
    value: 'size',
    label: 'Kích thước',
    icon: <Ruler size={18} />,
    placeholder: 'Ví dụ: 50, 100, 150, 200'
  },
  {
    value: 'material',
    label: 'Chất liệu',
    icon: <Package size={18} />,
    placeholder: 'Ví dụ: PP, PE, Nylon'
  }
]

function getTypeLabel(type) {
  return TYPES.find((item) => item.value === type)?.label || type
}

function getTypeIcon(type) {
  return TYPES.find((item) => item.value === type)?.icon
}

export default function AdminProductAttributes() {
  const [attributes, setAttributes] = useState([])
  const [type, setType] = useState('category')
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    loadAttributes()
  }, [])

  const currentType = TYPES.find((item) => item.value === type)

  const filteredAttributes = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return attributes.filter((item) => {
      const matchType = item.type === type
      const matchSearch =
        !keyword || item.name?.toLowerCase().includes(keyword)

      return matchType && matchSearch
    })
  }, [attributes, type, search])

  const stats = useMemo(() => {
    return TYPES.map((item) => ({
      ...item,
      count: attributes.filter((attr) => attr.type === item.value).length
    }))
  }, [attributes])

  async function loadAttributes() {
    try {
      const { data } = await api.get('/product-attributes')
      setAttributes(data)
    } catch {
      toast.error('Không thể tải thuộc tính.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên thuộc tính.')
      return
    }

    try {
      setLoading(true)

      await api.post('/product-attributes', {
        type,
        name: name.trim()
      })

      toast.success('Thêm thuộc tính thành công.')
      setName('')
      await loadAttributes()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Không thể thêm thuộc tính.')
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    try {
      setLoading(true)
      await api.delete(`/product-attributes/${deleteTarget.id}`)
      toast.success('Đã xóa thuộc tính.')
      setDeleteTarget(null)
      await loadAttributes()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Không thể xóa thuộc tính.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-attributes-page">
      <Toaster position="top-right" />

      <section className="admin-attributes-hero">
        <div>
          <span>Quản lý sản phẩm</span>
          <h1>Thuộc tính sản phẩm</h1>
          <p>
            Thêm nhanh danh mục, kích thước và chất liệu để dùng trong form sản phẩm.
          </p>
        </div>
      </section>

      <section className="attribute-stats-grid">
        {stats.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`attribute-stat-card ${type === item.value ? 'active' : ''}`}
            onClick={() => {
              setType(item.value)
              setSearch('')
            }}
          >
            <div className="attribute-stat-icon">{item.icon}</div>
            <div>
              <strong>{item.label}</strong>
              <span>{item.count} mục</span>
            </div>
          </button>
        ))}
      </section>

      <section className="admin-attributes-form-card">
        <div className="attributes-form-header">
          <div>
            <h2>Thêm thuộc tính mới</h2>
            <p>{currentType?.placeholder}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-attributes-form">
          <div className="attribute-input-group">
            <span>{currentType?.icon}</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="attribute-input-group wide">
            <span>
              <Plus size={18} />
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={currentType?.placeholder}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Thêm thuộc tính'}
          </button>
        </form>
      </section>

      <section className="admin-attributes-card">
        <div className="attributes-list-header">
          <div>
            <h2>{getTypeLabel(type)}</h2>
            <p>
              {filteredAttributes.length} thuộc tính đang hiển thị
            </p>
          </div>

          <div className="attributes-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thuộc tính..."
            />
          </div>
        </div>

        {filteredAttributes.length > 0 ? (
          <div className="attributes-grid">
            {filteredAttributes.map((item) => (
              <article key={item.id} className="attribute-card">
                <div className="attribute-card-icon">
                  {getTypeIcon(item.type)}
                </div>

                <div>
                  <strong>
                    {item.name}
                    {item.type === 'size' ? ' m' : ''}
                  </strong>
                  <span>{getTypeLabel(item.type)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label="Xóa thuộc tính"
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="attributes-empty">
            <div>
              {currentType?.icon}
            </div>
            <h3>Chưa có thuộc tính</h3>
            <p>Hãy thêm thuộc tính mới để dùng khi tạo sản phẩm.</p>
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="attribute-modal-overlay">
          <div className="attribute-delete-modal">
            <button
              type="button"
              className="attribute-modal-close"
              onClick={() => setDeleteTarget(null)}
            >
              <X size={18} />
            </button>

            <div className="attribute-delete-icon">
              <Trash2 size={24} />
            </div>

            <h3>Xác nhận xóa</h3>

            <p>
              Bạn có chắc muốn xóa thuộc tính{' '}
              <strong>{deleteTarget.name}</strong>? Thao tác này không thể hoàn tác.
            </p>

            <div className="attribute-modal-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Hủy
              </button>

              <button
                type="button"
                className="confirm"
                onClick={confirmDelete}
                disabled={loading}
              >
                Xóa thuộc tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}