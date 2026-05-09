import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { 
  createUser, 
  getUserByEmail, 
  getUserById, 
  updateUser, 
  verifyPassword 
} from '../models/userModel.js';

const jwtExpire = '7d';

/**
 * Đăng ký tài khoản thủ công
 */
export async function register(req, res) {
  try {
    const { full_name, email, phone, password, address } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await getUserByEmail(normalizedEmail);
    
    if (existing) {
      return res.status(409).json({ error: 'Email đã tồn tại trên hệ thống.' });
    }

    const user = await createUser({ 
      full_name, 
      email: normalizedEmail, 
      phone, 
      password, 
      address, 
      role: 'customer' 
    });

    const token = jwt.sign(
      { id: user.id, role: 'customer' }, 
      process.env.JWT_SECRET, 
      { expiresIn: jwtExpire }
    );

    res.status(201).json({ 
      token, 
      user: { id: user.id, full_name, email: normalizedEmail, role: 'customer' } 
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ error: 'Đăng ký thất bại.' });
  }
}

/**
 * Đăng nhập thủ công
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email?.toLowerCase().trim());

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: jwtExpire }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Đăng nhập thất bại.' });
  }
}

/**
 * Đăng nhập Google - Tự động lưu/cập nhật vào SQL
 */
export async function socialLogin(req, res) {
  try {
    const { email, full_name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Thông tin từ Google không hợp lệ.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const [rows] = await pool.query(
      'SELECT id, full_name, email, role FROM users WHERE email = ?', 
      [normalizedEmail]
    );
    let user = rows[0];

    if (!user) {
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [full_name, normalizedEmail, '', 'customer']
      );
      user = { id: result.insertId, full_name, email: normalizedEmail, role: 'customer' };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: jwtExpire }
    );

    res.json({ 
      token, 
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('SQL Social Login Error:', error.message);
    res.status(500).json({ error: 'Lỗi máy chủ khi xác thực Google.' });
  }
}

/**
 * Lấy thông tin cá nhân
 */
export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại.' });
    
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server.' });
  }
}

/**
 * Cập nhật thông tin cá nhân
 */
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, email, phone, address } = req.body;
    const user = await getUserById(userId);
    
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại.' });

    const updatedUser = await updateUser(userId, {
      full_name: full_name || user.full_name,
      email: email?.toLowerCase().trim() || user.email,
      phone: phone ?? user.phone,
      address: address ?? user.address,
      role: user.role
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ error: 'Cập nhật thất bại.' });
  }
}