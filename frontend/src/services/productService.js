import api from './api'

<<<<<<< HEAD
=======
// Lấy danh sách sản phẩm
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
export async function fetchProducts(params) {
  const response = await api.get('/products', { params })
  return response.data
}

<<<<<<< HEAD
=======
// CHI TIẾT SẢN PHẨM (Hàm này đang thiếu nên gây lỗi)
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data
}

<<<<<<< HEAD
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
=======
// Tạo sản phẩm mới
export async function createProduct(data) {
  const isFormData = data instanceof FormData;
  const response = await api.post('/products', data, {
    headers: { 
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' 
    }
  });
  return response.data;
}

// Cập nhật sản phẩm
export async function updateProduct(id, data) {
  const isFormData = data instanceof FormData;
  const response = await api.put(`/products/${id}`, data, {
    headers: { 
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' 
    }
  });
  return response.data;
}

// Xóa sản phẩm
export async function deleteProduct(id) {
  return (await api.delete(`/products/${id}`)).data
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
