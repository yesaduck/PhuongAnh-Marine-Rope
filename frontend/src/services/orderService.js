import api from './api'

export async function createOrder(orderData) {
  const response = await api.post('/orders', orderData)
  return response.data
}

export async function fetchOrders() {
  const response = await api.get('/orders')
  return response.data
}

export async function fetchMyOrders() {
  const response = await api.get('/orders/my')
  return response.data
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/orders/${id}`, { status })
  return response.data
}
