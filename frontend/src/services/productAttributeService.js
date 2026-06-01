import api from './api'

export async function fetchProductAttributes() {
  const response = await api.get('/product-attributes')
  return response.data
}

export async function createProductAttribute(payload) {
  const response = await api.post('/product-attributes', payload)
  return response.data
}

export async function updateProductAttribute(id, payload) {
  const response = await api.put(`/product-attributes/${id}`, payload)
  return response.data
}

export async function deleteProductAttribute(id) {
  const response = await api.delete(`/product-attributes/${id}`)
  return response.data
}