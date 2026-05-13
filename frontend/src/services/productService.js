import api from './api'

function normalizeProduct(product = {}) {
  return {
    name: product.name || '',
    description: product.description || '',
    category: product.category || 'Khác',
    price: Number(product.price || 1),
    size: product.size || '',
    material: product.material || '',
    stock: Number(product.stock || 0),
    images: Array.isArray(product.images) ? product.images : []
  }
}

function buildProductBody(payload = {}) {
  const data = normalizeProduct(payload)
  const files = payload.imageFiles || []

  if (files.length > 0) {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('category', data.category)
    formData.append('price', data.price)
    formData.append('size', data.size)
    formData.append('material', data.material)
    formData.append('stock', data.stock)

    data.images.forEach((url) => {
      formData.append('images', url)
    })

    files.forEach((file) => {
      formData.append('images', file)
    })

    return formData
  }

  return data
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