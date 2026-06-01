import pool from '../config/db.js'

export async function getAllAttributes() {
  const [rows] = await pool.query(
    'SELECT * FROM product_attributes ORDER BY type ASC, name ASC'
  )

  return rows
}

export async function createAttribute(data) {
  const { type, name } = data

  const [result] = await pool.query(
    'INSERT INTO product_attributes (type, name) VALUES (?, ?)',
    [type, name]
  )

  return {
    id: result.insertId,
    type,
    name
  }
}

export async function updateAttribute(id, data) {
  const { type, name } = data

  await pool.query(
    'UPDATE product_attributes SET type = ?, name = ? WHERE id = ?',
    [type, name, id]
  )

  const [rows] = await pool.query(
    'SELECT * FROM product_attributes WHERE id = ?',
    [id]
  )

  return rows[0]
}

export async function deleteAttribute(id) {
  const [result] = await pool.query(
    'DELETE FROM product_attributes WHERE id = ?',
    [id]
  )

  return result.affectedRows > 0
}