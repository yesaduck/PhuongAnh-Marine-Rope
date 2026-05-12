import pool from '../config/db.js'

<<<<<<< HEAD
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
=======
export async function getAllProducts(query = {}) {
	const { search, category, limit = 100, offset = 0 } = query
	let sql = 'SELECT * FROM products'
	const params = []

	const where = []
	if (search) {
		where.push('(name LIKE ? OR description LIKE ?)')
		params.push(`%${search}%`, `%${search}%`)
	}
	if (category) {
		where.push('category = ?')
		params.push(category)
	}
	if (where.length) sql += ' WHERE ' + where.join(' AND ')
	sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
	params.push(Number(limit), Number(offset))

	const [rows] = await pool.query(sql, params)
	return rows
}

export async function getProductById(id) {
	const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id])
	return rows[0]
}

export async function createProduct(data) {
	const { name, description = '', category = '', price = 0, size = '', material = '', stock = 0 } = data

	let images = null
	if (data.images) {
		// images may already be a JSON string or an array
		if (typeof data.images === 'string') {
			try { JSON.parse(data.images); images = data.images } catch { images = JSON.stringify([data.images]) }
		} else {
			images = JSON.stringify(data.images)
		}
	}

	const [result] = await pool.query(
		'INSERT INTO products (name, description, category, price, size, material, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
		[name, description, category, Number(price) || 0, size, material, Number(stock) || 0, images]
	)

	return getProductById(result.insertId)
}

export async function updateProduct(id, data) {
	const fields = []
	const params = []
	const allowed = ['name', 'description', 'category', 'price', 'size', 'material', 'stock', 'images']
	for (const key of allowed) {
		if (key in data) {
			if (key === 'images') {
				let imagesVal = data.images
				if (typeof imagesVal !== 'string') imagesVal = JSON.stringify(imagesVal)
				fields.push('images = ?')
				params.push(imagesVal)
			} else {
				fields.push(`${key} = ?`)
				params.push(data[key])
			}
		}
	}
	if (fields.length === 0) return getProductById(id)

	params.push(id)
	const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`
	await pool.query(sql, params)
	return getProductById(id)
}

export async function deleteProduct(id) {
	await pool.query('DELETE FROM products WHERE id = ?', [id])
}

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
