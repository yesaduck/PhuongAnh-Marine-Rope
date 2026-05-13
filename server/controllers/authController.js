import jwt from 'jsonwebtoken'
import {
  createUser,
  createGoogleUser,
  getUserByEmail,
  getUserById,
  updateUser,
  verifyPassword
} from '../models/userModel.js'

const jwtExpire = '7d'

export async function register(req, res) {
  try {
    const { full_name, email, phone, password, address } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc.'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await getUserByEmail(normalizedEmail)

    if (existing) {
      return res.status(409).json({
        error: 'Email đã tồn tại trên hệ thống.'
      })
    }

    await createUser({
      full_name,
      email: normalizedEmail,
      phone,
      password,
      address,
      role: 'customer'
    })

    return res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng đăng nhập.'
    })
  } catch (error) {
    console.error('Register Error:', error.message)
    res.status(500).json({
      error: 'Đăng ký thất bại.'
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await getUserByEmail(email?.toLowerCase().trim())

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({
        error: 'Email hoặc mật khẩu không đúng.'
      })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: jwtExpire }
    )

    const { password: _, ...safeUser } = user

    res.json({
      token,
      user: safeUser
    })
  } catch (error) {
    console.error('Login Error:', error.message)
    res.status(500).json({
      error: 'Đăng nhập thất bại.'
    })
  }
}

export async function socialLogin(req, res) {
  try {
    const { email, full_name } = req.body

    if (!email) {
      return res.status(400).json({
        error: 'Google không trả về email hợp lệ.'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user = await getUserByEmail(normalizedEmail)

    if (!user) {
      user = await createGoogleUser({
        full_name: full_name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'customer'
      })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: jwtExpire }
    )

    const { password: _, ...safeUser } = user

    res.json({
      token,
      user: safeUser
    })
  } catch (error) {
    console.error('Google Login Error:', error.message)
    res.status(500).json({
      error: 'Đăng nhập Google thất bại.'
    })
  }
}

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id)

    if (!user) {
      return res.status(404).json({
        error: 'Người dùng không tồn tại.'
      })
    }

    const { password: _, ...safeUser } = user

    res.json(safeUser)
  } catch (error) {
    console.error('Get Profile Error:', error.message)
    res.status(500).json({
      error: 'Lỗi server.'
    })
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id
    const { full_name, email, phone, address } = req.body

    const user = await getUserById(userId)

    if (!user) {
      return res.status(404).json({
        error: 'Người dùng không tồn tại.'
      })
    }

    const updatedUser = await updateUser(userId, {
      full_name: full_name || user.full_name,
      email: email?.toLowerCase().trim() || user.email,
      phone: phone ?? user.phone,
      address: address ?? user.address,
      role: user.role
    })

    const { password: _, ...safeUser } = updatedUser

    res.json(safeUser)
  } catch (error) {
    console.error('Update Profile Error:', error.message)
    res.status(500).json({
      error: 'Cập nhật thất bại.'
    })
  }
}