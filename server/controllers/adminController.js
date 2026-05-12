<<<<<<< HEAD
import jwt from 'jsonwebtoken'

export async function login(req, res) {
  const { username, password } = req.body
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' })
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' })
  res.json({ token })
}
=======
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Đăng nhập dành riêng cho Admin (Sử dụng dữ liệu từ Database)
export async function login(req, res) {
  try {
    const { email, password } = req.body; // Dùng email cho đồng nhất hệ thống

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại hoặc không có quyền Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập Admin.' });
  }
}

// Lấy danh sách tất cả người dùng (Dành cho trang quản trị)
export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, full_name, email, phone, role, created_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng.' });
  }
}

// Thay đổi quyền hạn (Role) người dùng - Tối ưu thay cho SQL
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['admin', 'staff', 'customer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: 'Cập nhật quyền hạn thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật quyền hạn.' });
  }
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
