import * as productModel from '../models/productModel.js'

export async function getProducts(req, res) {
  const result = await productModel.getAllProducts(req.query)
  const parsed = result.items.map((product) => ({
    ...product,
    images: product.images ? JSON.parse(product.images) : []
  }))
  res.json({ items: parsed, total: result.total })
}

export async function getProduct(req, res) {
  const { id } = req.params
  const product = await productModel.getProductById(id)
  if (!product) {
    return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
  }
  product.images = product.images ? JSON.parse(product.images) : []
  res.json(product)
}

export async function createProduct(req, res) {
  const product = await productModel.createProduct(req.body)
  res.status(201).json(product)
}

export async function updateProduct(req, res) {
  const { id } = req.params
  const existing = await productModel.getProductById(id)
  if (!existing) {
    return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
  }
  const updated = await productModel.updateProduct(id, req.body)
  res.json(updated)
}

export async function deleteProduct(req, res) {
  const { id } = req.params
  await productModel.deleteProduct(id)
  res.json({ success: true })
}
