import api from './api'

const TOKEN_KEY = 'pa_token'
const USER_KEY = 'pa_user'

function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUserRole() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored).role : null
  } catch {
    return null
  }
}

export function getUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)
  saveSession(response.data)
  return response.data
}

export async function loginAdmin(credentials) {
  const data = await login({ email: credentials.username, password: credentials.password })
  if (!['admin', 'staff'].includes(data.user.role)) {
    throw new Error('Bạn không có quyền quản trị.')
  }
  return data
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload)
  saveSession(response.data)
  return response.data
}

export async function getProfile() {
  const response = await api.get('/auth/profile')
  return response.data
}

export async function updateProfile(payload) {
  const response = await api.put('/auth/profile', payload)
  localStorage.setItem(USER_KEY, JSON.stringify(response.data))
  return response.data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
