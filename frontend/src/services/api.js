import axios from 'axios'

const TOKEN_KEY = 'pa_token'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type']
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('pa_user')
    }
    return Promise.reject(error)
  }
)

export default api
