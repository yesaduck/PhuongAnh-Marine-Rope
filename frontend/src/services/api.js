import axios from 'axios'

const TOKEN_KEY = 'pa_token'
const USER_KEY = 'pa_user'
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    // FormData thì để browser tự set multipart/form-data
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      // Nếu không phải đang ở trang login thì chuyển về login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api