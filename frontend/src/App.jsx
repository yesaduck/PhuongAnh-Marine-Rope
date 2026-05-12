import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
<<<<<<< HEAD
import AdminLogin from './pages/AdminLogin'
=======
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
import { getToken, getUserRole } from './services/authService'

function ProtectedRoute({ children, roles = [] }) {
  const token = getToken()
  const role = getUserRole()
<<<<<<< HEAD

  if (!token) return <Navigate to="/login" replace />
  if (roles.length > 0 && !roles.includes(role)) return <Navigate to="/" replace />

=======
  if (!token) return <Navigate to="/login" replace />
  if (roles.length > 0 && !roles.includes(role)) return <Navigate to="/" replace />
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  return children
}

function AuthRoute({ children }) {
  const token = getToken()
  if (token) return <Navigate to="/" replace />
  return children
}

export default function App() {
<<<<<<< HEAD
  return (
    <BrowserRouter>
      <Routes>
=======
  const role = getUserRole();

  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        </Route>

<<<<<<< HEAD
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/admin/login" element={<AuthRoute><AdminLogin /></AuthRoute>} />
=======
        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Admin Routes */}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
        <Route path="/admin" element={<ProtectedRoute roles={['admin', 'staff']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        </Route>
<<<<<<< HEAD
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
=======

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to={(role === 'admin' || role === 'staff') ? "/admin" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
