import api from './api'

export async function fetchProducts(params) {
  const response = await api.get('/products', { params })
  return response.data
}

export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export async function createProduct(data) {
  return (await api.post('/products', data)).data
}

export async function updateProduct(id, data) {
  return (await api.put(`/products/${id}`, data)).data
}

export async function deleteProduct(id) {
  return (await api.delete(`/products/${id}`)).data
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}
