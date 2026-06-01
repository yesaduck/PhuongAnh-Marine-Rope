import pool from '../config/db.js'

export async function createOrder(orderData) {
  const {
    user_id,
    customer_name,
    phone,
    address,
    note = '',
    total_price = 0,
    status = 'pending',
    items = []
  } = orderData

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `
      INSERT INTO orders 
      (user_id, customer_name, phone, address, note, total_price, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [user_id, customer_name, phone, address, note, Number(total_price || 0), status]
    )

    const orderId = result.insertId

    const itemValues = items.map((item) => [
      orderId,
      item.product_id,
      Number(item.quantity || 1),
      Number(item.price || 0)
    ])

    if (itemValues.length > 0) {
      await connection.query(
        `
        INSERT INTO order_items 
        (order_id, product_id, quantity, price) 
        VALUES ?
        `,
        [itemValues]
      )
    }

    await connection.commit()
    return getOrderById(orderId)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

function mapOrderItems(items) {
  return items.map((item) => ({
    ...item,
    image: item.product_images || ''
  }))
}

async function getItemsByOrderIds(orderIds) {
  if (!orderIds.length) return []

  const [items] = await pool.query(
    `
    SELECT 
      oi.*,
      p.name AS product_name,
      p.images AS product_images
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id IN (?)
    `,
    [orderIds]
  )

  return mapOrderItems(items)
}

export async function getAllOrders() {
  const [orders] = await pool.query(
    'SELECT * FROM orders ORDER BY created_at DESC'
  )

  const orderIds = orders.map((order) => order.id)
  const items = await getItemsByOrderIds(orderIds)

  const orderItemsMap = items.reduce((map, item) => {
    map[item.order_id] = map[item.order_id] || []
    map[item.order_id].push(item)
    return map
  }, {})

  return orders.map((order) => ({
    ...order,
    items: orderItemsMap[order.id] || []
  }))
}

export async function getOrderById(id) {
  const [orders] = await pool.query(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  )

  if (!orders.length) return null

  const items = await getItemsByOrderIds([id])

  return {
    ...orders[0],
    items
  }
}

export async function updateOrderStatus(id, status) {
  const [result] = await pool.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  )

  if (result.affectedRows === 0) return null

  return getOrderById(id)
}

export async function getOrdersByUserId(userId) {
  const [orders] = await pool.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )

  const orderIds = orders.map((order) => order.id)
  const items = await getItemsByOrderIds(orderIds)

  const orderItemsMap = items.reduce((map, item) => {
    map[item.order_id] = map[item.order_id] || []
    map[item.order_id].push(item)
    return map
  }, {})

  return orders.map((order) => ({
    ...order,
    items: orderItemsMap[order.id] || []
  }))
}
