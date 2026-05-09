import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';

// Middleware xác thực Token chung
export const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await getUserById(decoded.id);
      if (!user) return res.status(401).json({ error: 'Người dùng không tồn tại.' });

      const { password, ...safeUser } = user;
      req.user = safeUser; // Gán user vào request để dùng ở các bước sau
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  }
  return res.status(401).json({ error: 'Yêu cầu token xác thực (Bearer token).' });
};

// Middleware phân quyền dựa trên mảng các role cho phép
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Bạn không có quyền truy cập tính năng này.' });
    }
    next();
  };
};