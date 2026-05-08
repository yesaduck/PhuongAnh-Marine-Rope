import pool from '../config/db.js'

export async function createOrder(orderData) {
  const { user_id, customer_name, customer_phone, customer_address, note, total_price, status, items } = orderData
  const [result] = await pool.query(
    'INSERT INTO orders (user_id, customer_name, phone, address, note, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, customer_name, customer_phone, customer_address, note, total_price, status || 'pending']
  )

  const orderId = result.insertId
  const itemValues = (items || []).map((item) => [orderId, item.product_id || item.productId, item.quantity, item.price])
  if (itemValues.length) {
    await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [itemValues])
  }

  return getOrderById(orderId)
}

export async function getAllOrders() {
  const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
  const orderIds = orders.map((order) => order.id)
  if (!orderIds.length) {
    return []
  }

  const [items] = await pool.query(
    'SELECT oi.*, p.name AS product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE order_id IN (?)',
    [orderIds]
  )

  const orderItemsMap = items.reduce((map, item) => {
    map[item.order_id] = map[item.order_id] || []
    map[item.order_id].push(item)
    return map
  }, {})

  return orders.map((order) => ({ ...order, items: orderItemsMap[order.id] || [] }))
}

export async function getOrderById(id) {
  const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id])
  if (!orders.length) return null

  const [items] = await pool.query(
    'SELECT oi.*, p.name AS product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE order_id = ?',
    [id]
  )

  return { ...orders[0], items }
}

export async function updateOrderStatus(id, status) {
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id])
  return getOrderById(id)
}

export async function getOrdersByUserId(userId) {
  const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId])
  const orderIds = orders.map((order) => order.id)
  if (!orderIds.length) {
    return []
  }

  const [items] = await pool.query(
    'SELECT oi.*, p.name AS product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE order_id IN (?)',
    [orderIds]
  )

  const orderItemsMap = items.reduce((map, item) => {
    map[item.order_id] = map[item.order_id] || []
    map[item.order_id].push(item)
    return map
  }, {})

  return orders.map((order) => ({ ...order, items: orderItemsMap[order.id] || [] }))
}
