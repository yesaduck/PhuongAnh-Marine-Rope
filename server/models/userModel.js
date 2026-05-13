import pool from '../config/db.js'
import bcrypt from 'bcryptjs'

export async function createUser(userData) {
  const {
    full_name,
    email,
    phone = '',
    password,
    role = 'customer',
    address = ''
  } = userData

  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, phone, password, role, address) VALUES (?, ?, ?, ?, ?, ?)',
    [full_name, email, phone, hashedPassword, role, address]
  )

  return {
    id: result.insertId,
    full_name,
    email,
    phone,
    role,
    address
  }
}

export async function createGoogleUser(userData) {
  const {
    full_name,
    email,
    phone = '',
    role = 'customer',
    address = ''
  } = userData

  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, phone, password, role, address) VALUES (?, ?, ?, ?, ?, ?)',
    [full_name, email, phone, '', role, address]
  )

  return {
    id: result.insertId,
    full_name,
    email,
    phone,
    role,
    address
  }
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  return rows[0]
}

export async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, phone, role, address, created_at FROM users WHERE id = ?',
    [id]
  )

  return rows[0]
}

export async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, phone, role, address, created_at FROM users ORDER BY created_at DESC'
  )

  return rows
}

export async function updateUser(id, userData) {
  const existing = await getUserById(id)

  if (!existing) {
    return null
  }

  const {
    full_name = existing.full_name,
    email = existing.email,
    phone = existing.phone,
    role = existing.role,
    address = existing.address
  } = userData

  await pool.query(
    'UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, address = ? WHERE id = ?',
    [full_name, email, phone, role, address, id]
  )

  return getUserById(id)
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id])
}

export async function verifyPassword(plainPassword, hashedPassword) {
  if (!hashedPassword) return false
  return bcrypt.compare(plainPassword, hashedPassword)
}