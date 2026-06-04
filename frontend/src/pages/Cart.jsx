import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  PackageCheck,
  ShieldCheck
} from 'lucide-react'
import {
  getCart,
  removeItem,
  updateItem,
  clearCart
} from '../services/cartService'
import { getImageUrl } from '../utils/imageHelpers'
import './Cart.css'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="400"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="Arial" font-size="28">No Image</text></svg>'

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export default function Cart() {
  const [items, setItems] = useState([])
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: '',
    cartItemKey: null,
    count: 0
  })

  const navigate = useNavigate()

  useEffect(() => {
    setItems(getCart())
  }, [])

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }, [items])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0)
    }, 0)
  }, [items])

  function handleUpdate(cartItemKey, quantity) {
    const nextQuantity = Math.max(1, Number(quantity || 1))
    setItems(updateItem(cartItemKey, nextQuantity))
  }

  function openDeleteProductModal(cartItemKey) {
    setDeleteModal({
      open: true,
      type: 'single',
      cartItemKey,
      count: 1
    })
  }

  function openClearCartModal() {
    setDeleteModal({
      open: true,
      type: 'all',
      cartItemKey: null,
      count: items.length
    })
  }

  function closeDeleteModal() {
    setDeleteModal({
      open: false,
      type: '',
      cartItemKey: null,
      count: 0
    })
  }

  function confirmDelete() {
    if (deleteModal.type === 'single') {
      setItems(removeItem(deleteModal.cartItemKey))
    }

    if (deleteModal.type === 'all') {
      clearCart()
      setItems([])
    }

    closeDeleteModal()
  }

  return (
    <div className="cart-page">
      <section className="cart-hero">
        <div>
          <span className="cart-badge-title">
            <ShoppingCart size={16} />
            Giỏ hàng
          </span>

          <h1>Giỏ hàng của bạn</h1>

          <p>
            Kiểm tra biến thể, số lượng và tổng tiền trước khi đặt hàng.
          </p>
        </div>

        <Link to="/products" className="cart-back-link">
          <ArrowLeft size={17} />
          Tiếp tục mua hàng
        </Link>
      </section>

      {items.length === 0 ? (
        <section className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingCart size={46} />
          </div>

          <h2>Giỏ hàng đang trống</h2>

          <p>
            Hãy chọn sản phẩm dây ngư nghiệp phù hợp để bắt đầu đặt hàng.
          </p>

          <Link to="/products">Xem sản phẩm</Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-list-card">
            <div className="cart-list-header">
              <div>
                <h2>Sản phẩm đã chọn</h2>
                <p>{totalItems} cuộn trong giỏ hàng</p>
              </div>

              <button type="button" onClick={openClearCartModal}>
                <Trash2 size={16} />
                Xóa tất cả
              </button>
            </div>

            <div className="cart-items">
              {items.map((item) => (
                <article key={item.cartItemKey} className="cart-item">
                  <Link
                    to={`/products/${item.productId}`}
                    className="cart-item-image"
                  >
                    <img
                      src={getImageUrl(item.image || item.imageUrl)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = FALLBACK_IMAGE
                      }}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="cart-item-name"
                      >
                        {item.name}
                      </Link>

                      <p className="cart-item-meta">
                        {item.category || 'Sản phẩm'} ·{' '}
                        {item.size ? `${item.size}m` : 'Chưa có kích thước'} ·{' '}
                        {item.material || 'Chưa có chất liệu'} ·{' '}
                        {item.weight_kg || 0}kg/cuộn
                      </p>
                    </div>

                    <strong className="cart-item-price">
                      {formatMoney(item.price)} / cuộn
                    </strong>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(item.cartItemKey, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdate(item.cartItemKey, e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(item.cartItemKey, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-subtotal">
                      {formatMoney(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      )}
                    </p>

                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => openDeleteProductModal(item.cartItemKey)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-summary-card">
            <h2>Tóm tắt đơn hàng</h2>

            <div className="summary-row">
              <span>Số lượng</span>
              <strong>{totalItems} cuộn</strong>
            </div>

            <div className="summary-row">
              <span>Tạm tính</span>
              <strong>{formatMoney(totalPrice)}</strong>
            </div>

            <div className="summary-total">
              <span>Tổng tiền</span>
              <strong>{formatMoney(totalPrice)}</strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Tiến hành đặt hàng
            </button>

            <div className="summary-benefits">
              <div>
                <ShieldCheck size={17} />
                <span>Thông tin đặt hàng được bảo mật</span>
              </div>

              <div>
                <PackageCheck size={17} />
                <span>Hỗ trợ tư vấn sản phẩm phù hợp</span>
              </div>
            </div>
          </aside>
        </section>
      )}

      {deleteModal.open && (
        <div className="delete-modal-overlay" onClick={closeDeleteModal}>
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Xác nhận xóa</h3>

            <p>
              Bạn có chắc muốn xóa{' '}
              <strong>
                {deleteModal.type === 'all'
                  ? `${deleteModal.count} sản phẩm`
                  : '1 sản phẩm'}
              </strong>
              ? Thao tác này không thể hoàn tác.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>

              <button
                type="button"
                className="delete-modal-confirm"
                onClick={confirmDelete}
              >
                {deleteModal.type === 'all'
                  ? 'Xóa tất cả'
                  : 'Xóa sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}