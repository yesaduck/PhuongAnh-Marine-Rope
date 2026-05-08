import pool from '../config/db.js'

export async function getAllProducts(params = {}) {
  const { limit, page = 1, category, search } = params
  const conditions = []
  const values = []

  if (category) {
    conditions.push('category = ?')
    values.push(category)
  }
  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ?)')
    values.push(`%${search}%`, `%${search}%`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM products ${whereClause}`, values)
  const total = countRows[0]?.total || 0

  let paginationClause = ''
  if (limit) {
    paginationClause = 'LIMIT ? OFFSET ?'
    values.push(Number(limit), Math.max(0, (Number(page) - 1) * Number(limit)))
  }

  const [rows] = await pool.query(`SELECT * FROM products ${whereClause} ORDER BY created_at DESC ${paginationClause}`, values)
  return { items: rows, total }
}

export async function getProductById(id) {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id])
  return rows[0]
}

export async function createProduct(data) {
  const { name, description, category, price, size, material, stock, images } = data
  const [result] = await pool.query(
    'INSERT INTO products (name, description, category, price, size, material, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, category, price, size, material, stock, JSON.stringify(images || [])]
  )
  return { id: result.insertId, ...data }
}

export async function updateProduct(id, data) {
  const { name, description, category, price, size, material, stock, images } = data
  await pool.query(
    'UPDATE products SET name = ?, description = ?, category = ?, price = ?, size = ?, material = ?, stock = ?, images = ? WHERE id = ?',
    [name, description, category, price, size, material, stock, JSON.stringify(images || []), id]
  )
  return { id, ...data }
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = ?', [id])
}
