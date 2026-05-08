const CART_KEY = 'pa_cart'

export function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addItem(product, quantity = 1) {
  const cart = getCart()
  const existing = cart.find((item) => item.productId === product.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      material: product.material,
      image: product.images?.[0] || '',
      quantity
    })
  }
  saveCart(cart)
  return cart
}

export function updateItem(productId, quantity) {
  const cart = getCart().map((item) => {
    if (item.productId === productId) {
      return { ...item, quantity: Math.max(1, quantity) }
    }
    return item
  })
  const filtered = cart.filter((item) => item.quantity > 0)
  saveCart(filtered)
  return filtered
}

export function removeItem(productId) {
  const cart = getCart().filter((item) => item.productId !== productId)
  saveCart(cart)
  return cart
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}
