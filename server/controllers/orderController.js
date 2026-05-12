<<<<<<< HEAD
import * as orderModel from '../models/orderModel.js'

export async function createOrder(req, res) {
  const orderData = { ...req.body, user_id: req.user.id }
  const order = await orderModel.createOrder(orderData)
  res.status(201).json(order)
}

export async function getOrders(req, res) {
  const orders = await orderModel.getAllOrders()
  res.json(orders)
}

export async function getMyOrders(req, res) {
  const orders = await orderModel.getOrdersByUserId(req.user.id)
  res.json(orders)
}

export async function updateOrder(req, res) {
  const { id } = req.params
  const { status } = req.body
  const order = await orderModel.updateOrderStatus(id, status)
  res.json(order)
}
=======
import * as orderModel from '../models/orderModel.js';

export async function createOrder(req, res) {
  try {
    const orderData = { ...req.body, user_id: req.user.id };
    const order = await orderModel.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại dữ liệu.' });
  }
}

export async function getOrders(req, res) {
  try {
    // Chế độ dành cho Admin (Cần middleware checkRole('admin') ở routes)
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng.' });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy lịch sử đơn hàng.' });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Kiểm tra đơn hàng có tồn tại không trước khi update
    const updated = await orderModel.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại.' });
    }
    
    res.json({ success: true, message: 'Cập nhật trạng thái thành công.', order: updated });
  } catch (error) {
    res.status(400).json({ error: 'Cập nhật trạng thái thất bại.' });
  }
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
