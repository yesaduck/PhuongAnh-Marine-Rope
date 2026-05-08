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
