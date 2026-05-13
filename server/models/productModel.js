import pool from '../config/db.js'

function safeParseImages(images) {
  if (!images) return []

  if (Array.isArray(images)) return images

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function normalizeProduct(row) {
  return {
    ...row,
    images: safeParseImages(row.images)
  }
}

export async function getAllProducts(params = {}) {
  const { limit, page = 1, category, search } = params
  const conditions = []
  const values = []

  if (category) {
    conditions.push('category = ?')
    values.push(category)
  }

  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ? OR category LIKE ?)')
    values.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : ''

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products ${whereClause}`,
    values
  )

  const total = countRows[0]?.total || 0

  const queryValues = [...values]
  let paginationClause = ''

  if (limit) {
    paginationClause = 'LIMIT ? OFFSET ?'
    queryValues.push(
      Number(limit),
      Math.max(0, (Number(page) - 1) * Number(limit))
    )
  }

  const [rows] = await pool.query(
    `SELECT * FROM products ${whereClause} ORDER BY created_at DESC ${paginationClause}`,
    queryValues
  )

  return {
    items: rows.map(normalizeProduct),
    total
  }
}

export async function getProductById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  return rows[0] ? normalizeProduct(rows[0]) : null
}

export async function createProduct(data) {
  const {
    name,
    description,
    category,
    price,
    size,
    material,
    stock,
    images
  } = data

  const [result] = await pool.query(
    `INSERT INTO products 
    (name, description, category, price, size, material, stock, images) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      category,
      Number(price || 0),
      size,
      material,
      Number(stock || 0),
      JSON.stringify(safeParseImages(images))
    ]
  )

  return {
    id: result.insertId,
    ...data,
    images: safeParseImages(images)
  }
}

export async function updateProduct(id, data) {
  const {
    name,
    description,
    category,
    price,
    size,
    material,
    stock,
    images
  } = data

  await pool.query(
    `UPDATE products 
     SET name = ?, description = ?, category = ?, price = ?, size = ?, material = ?, stock = ?, images = ? 
     WHERE id = ?`,
    [
      name,
      description,
      category,
      Number(price || 0),
      size,
      material,
      Number(stock || 0),
      JSON.stringify(safeParseImages(images)),
      id
    ]
  )

  return {
    id,
    ...data,
    images: safeParseImages(images)
  }
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = ?', [id])
}