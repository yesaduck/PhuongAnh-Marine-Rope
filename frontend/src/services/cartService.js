import { getToken, getUser } from './authService'

const CART_CHANGED_EVENT = 'pa_cart_changed'

function getCartKey() {
  const token = getToken()
  const user = getUser()

  if (!token || !user?.id) {
    return null
  }

  return `pa_cart_user_${user.id}`
}

function emitCartChanged() {
  window.dispatchEvent(new Event(CART_CHANGED_EVENT))
}

function normalizeImages(images) {
  if (!images) return []

  if (Array.isArray(images)) {
    return images.filter(Boolean)
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [images]
    } catch {
      return images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isNaN(number) ? fallback : number
}

export function getCart() {
  const key = getCartKey()

  if (!key) return []

  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addItem(product, selectedVariant, quantity = 1) {
  const key = getCartKey()

  if (!key) {
    throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
  }

  if (!product?.id && !product?.productId) {
    throw new Error('Sản phẩm không hợp lệ.')
  }

  if (!selectedVariant?.id) {
    throw new Error('Vui lòng chọn loại sản phẩm.')
  }

  const cart = getCart()
  const images = normalizeImages(product.images || product.product_images)

  const productId = product.id || product.productId
  const variantId = selectedVariant.id
  const safeQuantity = Math.max(1, toNumber(quantity, 1))
  const cartItemKey = `${productId}_${variantId}`

  const existing = cart.find((item) => item.cartItemKey === cartItemKey)

  const newItem = {
    cartItemKey,
    productId,
    variantId,
    name: product.name || `Sản phẩm #${productId}`,
    price: toNumber(selectedVariant.price, 0),
    size: selectedVariant.size || '',
    material: selectedVariant.material || '',
    category: selectedVariant.category || '',
    weight_kg: toNumber(selectedVariant.weight_kg, 0),
    unit: selectedVariant.unit || 'cuộn',
    image: images[0] || product.image || product.imageUrl || selectedVariant.image || '',
    quantity: safeQuantity
  }

  const updatedCart = existing
    ? cart.map((item) =>
        item.cartItemKey === cartItemKey
          ? {
              ...item,
              ...newItem,
              quantity: toNumber(item.quantity, 0) + safeQuantity
            }
          : item
      )
    : [...cart, newItem]

  localStorage.setItem(key, JSON.stringify(updatedCart))
  emitCartChanged()
  return updatedCart
}

export function updateItem(cartItemKey, quantity) {
  const key = getCartKey()

  if (!key) return []

  const safeQuantity = Math.max(1, toNumber(quantity, 1))

  const updatedCart = getCart().map((item) =>
    item.cartItemKey === cartItemKey
      ? {
          ...item,
          quantity: safeQuantity
        }
      : item
  )

  localStorage.setItem(key, JSON.stringify(updatedCart))
  emitCartChanged()
  return updatedCart
}

export function removeItem(cartItemKey) {
  const key = getCartKey()

  if (!key) return []

  const updatedCart = getCart().filter((item) => item.cartItemKey !== cartItemKey)

  localStorage.setItem(key, JSON.stringify(updatedCart))
  emitCartChanged()
  return updatedCart
}

export function clearCart() {
  const key = getCartKey()

  if (key) {
    localStorage.removeItem(key)
  }

  emitCartChanged()
}

export function clearOldSharedCart() {
  localStorage.removeItem('pa_cart')
}

export function isCartAvailable() {
  return Boolean(getCartKey())
}

export { CART_CHANGED_EVENT }
