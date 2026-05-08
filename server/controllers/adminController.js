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
