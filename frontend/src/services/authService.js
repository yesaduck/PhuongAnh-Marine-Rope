import api from './api'

const TOKEN_KEY = 'pa_token'
const USER_KEY = 'pa_user'

function saveSession(data = {}) {
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
  }

  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  // Xóa key cũ nếu trước đây dùng tên khác
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/* =========================
   AUTH
========================= */

export async function login(credentials) {
  const response = await api.post('/auth/login', {
    email: credentials.email,
    password: credentials.password
  })

  saveSession(response.data)
  return response.data
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export async function socialLogin(payload) {
  const response = await api.post('/auth/social-login', payload)
  saveSession(response.data)
  return response.data
}

export async function loginAdmin(credentials) {
  const response = await api.post('/auth/login', {
    email: credentials.email || credentials.username,
    password: credentials.password
  })

  const data = response.data

  if (!data.user || !['admin', 'staff'].includes(data.user.role)) {
    clearSession()
    throw new Error('Bạn không có quyền truy cập khu vực quản trị.')
  }

  saveSession(data)
  return data
}

export function logout() {
  clearSession()
  window.location.href = '/login'
}

/* =========================
   PROFILE
========================= */

export async function getProfile() {
  const response = await api.get('/auth/profile')

  if (response.data) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data))
  }

  return response.data
}

export async function updateProfile(payload) {
  const response = await api.put('/auth/profile', payload)

  if (response.data) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data))
  }

  return response.data
}

/* =========================
   SESSION HELPERS
========================= */

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getCurrentUser() {
  return getUser()
}

export function getUserRole() {
  return getUser()?.role || null
}

export function isAuthenticated() {
  return !!getToken()
}

export function isAdmin() {
  return getUserRole() === 'admin'
}

export function isStaff() {
  return getUserRole() === 'staff'
}

export function canAccessAdmin() {
  return ['admin', 'staff'].includes(getUserRole())
}