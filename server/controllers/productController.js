import * as productModel from '../models/productModel.js';

export async function getProducts(req, res) {
  try {
    const result = await productModel.getAllProducts(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server.' });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await productModel.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const existing = await productModel.getProductById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });

    const updated = await productModel.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Cập nhật thất bại.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    await productModel.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Đã xóa sản phẩm.' });
  } catch (error) {
    res.status(500).json({ error: 'Xóa thất bại.' });
  }
}