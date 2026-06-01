import * as orderModel from '../models/orderModel.js'

export async function createOrder(req, res) {
  try {
    const { customer_name, phone, address, note, total_price, items } = req.body

    if (!customer_name?.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập họ tên khách hàng.' })
    }

    if (!phone?.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập số điện thoại.' })
    }

    if (!address?.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập địa chỉ giao hàng.' })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Giỏ hàng đang trống.' })
    }

    const normalizedItems = items.map((item) => ({
      product_id: item.product_id || item.productId || item.id,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0)
    }))

    const invalidItem = normalizedItems.find(
      (item) => !item.product_id || item.quantity <= 0 || item.price < 0
    )

    if (invalidItem) {
      return res.status(400).json({ error: 'Dữ liệu sản phẩm trong giỏ hàng không hợp lệ.' })
    }

    const orderData = {
      user_id: req.user.id,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note?.trim() || '',
      total_price: Number(total_price || 0),
      status: 'pending',
      items: normalizedItems
    }

    const order = await orderModel.createOrder(orderData)

    res.status(201).json(order)
  } catch (error) {
    console.error('Create Order Error:', error.message)
    res.status(400).json({
      error: error.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại dữ liệu.'
    })
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await orderModel.getAllOrders()
    res.json(orders)
  } catch (error) {
    console.error('Get Orders Error:', error.message)
    res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng.' })
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id)
    res.json(orders)
  } catch (error) {
    console.error('Get My Orders Error:', error.message)
    res.status(500).json({ error: 'Lỗi khi lấy lịch sử đơn hàng.' })
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái đơn hàng không hợp lệ.' })
    }

    const updated = await orderModel.updateOrderStatus(id, status)

    if (!updated) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại.' })
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công.',
      order: updated
    })
   } catch (error) {
  console.error('Create Order Error Full:', error)

  res.status(400).json({
    error: error.message || 'Không thể tạo đơn hàng.',
    sqlMessage: error.sqlMessage || '',
    code: error.code || ''
  })
}
}