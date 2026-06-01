import api from './api'

export const PRICE_PER_KG = 100000

function toNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isNaN(number) ? fallback : number
}

export function calculateProductPrice(weightKg) {
  return toNumber(weightKg, 0) * PRICE_PER_KG
}

function normalizeImages(images) {
  if (!images) return []
  if (Array.isArray(images)) return images

  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return String(images)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

function normalizeVariants(variants = []) {
  if (!variants) return []

  if (typeof variants === 'string') {
    try {
      variants = JSON.parse(variants)
    } catch {
      variants = []
    }
  }

  if (!Array.isArray(variants)) return []

  return variants.map((item) => {
    const weightKg = toNumber(item.weight_kg, 0)

    return {
      id: item.id,
      category: item.category || '',
      size: item.size || '',
      material: item.material || '',
      weight_kg: weightKg,
      unit: item.unit || 'cuộn',
      price: item.price
        ? toNumber(item.price, 0)
        : calculateProductPrice(weightKg),
      stock: toNumber(item.stock, 0)
    }
  })
}

function buildProductBody(product = {}) {
  const files = product.imageFiles || []

  const data = {
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    size: product.size || '',
    material: product.material || '',
    weight_kg: toNumber(product.weight_kg, 0),
    unit: product.unit || 'cuộn',
    price: product.price
      ? toNumber(product.price, 0)
      : calculateProductPrice(product.weight_kg),
    stock: toNumber(product.stock, 0),
    images: normalizeImages(product.images),
    variants: normalizeVariants(product.variants)
  }

  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('category', data.category)
  formData.append('size', data.size)
  formData.append('material', data.material)
  formData.append('weight_kg', data.weight_kg)
  formData.append('unit', data.unit)
  formData.append('price', data.price)
  formData.append('stock', data.stock)
  formData.append('variants', JSON.stringify(data.variants))

  data.images.forEach((url) => {
    formData.append('images', url)
  })

  files.forEach((file) => {
    formData.append('images', file)
  })

  return formData
}

export async function fetchProducts(params = {}) {
  const response = await api.get('/products', { params })
  return response.data
}

export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export async function createProduct(payload) {
  const response = await api.post('/products', buildProductBody(payload))
  return response.data
}

export async function updateProduct(id, payload) {
  const response = await api.put(`/products/${id}`, buildProductBody(payload))
  return response.data
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`)
  return response.data
}