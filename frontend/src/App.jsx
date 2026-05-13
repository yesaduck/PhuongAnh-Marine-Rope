// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'

// User Pages
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'

// Auth Helpers
import {
  getToken,
  getUserRole
} from './services/authService'

/**
 * Route yêu cầu đăng nhập
 */
function ProtectedRoute({ children, roles = [] }) {
  const token = getToken()
  const role = getUserRole()

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Không đúng quyền
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}

/**
 * Route chỉ dành cho khách chưa đăng nhập
 */
function AuthRoute({ children, admin = false }) {
  const token = getToken()
  const role = getUserRole()

  if (token) {
    // Nếu là admin/staff hoặc đang vào trang admin login
    if (admin || role === 'admin' || role === 'staff') {
      return <Navigate to="/admin" replace />
    }

    // User thường
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  const role = getUserRole()

  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            USER WEBSITE
        ========================= */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />

          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =========================
            AUTH
        ========================= */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        <Route
          path="/admin/login"
          element={
            <AuthRoute admin>
              <AdminLogin />
            </AuthRoute>
          }
        />

        {/* =========================
            ADMIN PANEL
        ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />

          <Route
            path="users"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =========================
            FALLBACK
        ========================= */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                role === 'admin' || role === 'staff'
                  ? '/admin'
                  : '/'
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}