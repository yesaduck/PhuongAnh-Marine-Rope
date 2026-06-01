import pool from '../config/db.js'

const PRICE_PER_KG = 100000

function safeParseImages(images) {
  if (!images) return []
  if (Array.isArray(images)) return images

  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return String(images)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

function normalizeVariants(variants = []) {
  if (typeof variants === 'string') {
    try {
      variants = JSON.parse(variants)
    } catch {
      variants = []
    }
  }

  if (!Array.isArray(variants)) return []

  return variants
    .map((item) => {
      const weightKg = Number(item.weight_kg || 0)

      return {
        id: item.id,
        category: item.category || '',
        size: Number(item.size || 0),
        material: item.material || '',
        weight_kg: weightKg,
        unit: item.unit || 'cuộn',
        price: weightKg * PRICE_PER_KG,
        stock: Number(item.stock || 0)
      }
    })
    .filter((item) => item.category && item.size && item.material)
}

function normalizeProduct(row) {
  return {
    ...row,
    images: safeParseImages(row.images),
    variants: Array.isArray(row.variants) ? row.variants : []
  }
}

export async function getAllProducts(params = {}) {
  const { limit, page = 1, category, search } = params
  const conditions = []
  const values = []

  if (category) {
    conditions.push(`
      EXISTS (
        SELECT 1 FROM product_variants pv
        WHERE pv.product_id = p.id AND pv.category = ?
      )
    `)
    values.push(category)
  }

  if (search) {
    conditions.push(`
      (
        p.name LIKE ?
        OR p.description LIKE ?
        OR EXISTS (
          SELECT 1 FROM product_variants pv
          WHERE pv.product_id = p.id
          AND (pv.category LIKE ? OR pv.material LIKE ?)
        )
      )
    `)
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p ${whereClause}`,
    values
  )

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
    `
    SELECT
      p.*,
      MIN(pv.price) AS price,
      SUM(pv.stock) AS stock,
      MIN(pv.category) AS category,
      MIN(pv.size) AS size,
      MIN(pv.material) AS material,
      MIN(pv.weight_kg) AS weight_kg
    FROM products p
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    ${paginationClause}
    `,
    queryValues
  )

  return {
    items: rows.map(normalizeProduct),
    total: countRows[0]?.total || 0
  }
}

export async function getProductById(id) {
  const [products] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  if (!products.length) return null

  const [variants] = await pool.query(
    `
    SELECT *
    FROM product_variants
    WHERE product_id = ?
    ORDER BY size ASC, material ASC
    `,
    [id]
  )

  return normalizeProduct({
    ...products[0],
    variants
  })
}

export async function createProduct(data) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `
      INSERT INTO products (name, description, images)
      VALUES (?, ?, ?)
      `,
      [
        data.name,
        data.description || '',
        JSON.stringify(safeParseImages(data.images))
      ]
    )

    const productId = result.insertId
    const variants = normalizeVariants(data.variants)

    for (const variant of variants) {
      await connection.query(
        `
        INSERT INTO product_variants
        (product_id, category, size, material, weight_kg, unit, price, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          productId,
          variant.category,
          variant.size,
          variant.material,
          variant.weight_kg,
          variant.unit,
          variant.price,
          variant.stock
        ]
      )
    }

    await connection.commit()
    return getProductById(productId)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function updateProduct(id, data) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    await connection.query(
      `
      UPDATE products
      SET name = ?, description = ?, images = ?
      WHERE id = ?
      `,
      [
        data.name,
        data.description || '',
        JSON.stringify(safeParseImages(data.images)),
        id
      ]
    )

    await connection.query(
      'DELETE FROM product_variants WHERE product_id = ?',
      [id]
    )

    const variants = normalizeVariants(data.variants)

    for (const variant of variants) {
      await connection.query(
        `
        INSERT INTO product_variants
        (product_id, category, size, material, weight_kg, unit, price, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          variant.category,
          variant.size,
          variant.material,
          variant.weight_kg,
          variant.unit,
          variant.price,
          variant.stock
        ]
      )
    }

    await connection.commit()
    return getProductById(id)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = ?', [id])
}