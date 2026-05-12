<<<<<<< HEAD
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
=======
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
    const { name, price, category } = req.body;
    if (!name) return res.status(400).json({ error: "Tên sản phẩm là bắt buộc!" });
    if (!price || price < 0) return res.status(400).json({ error: "Giá sản phẩm không hợp lệ!" });

    const productData = { ...req.body };
    let imageUrls = [];

    // Nếu thêm thủ công qua FormData
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    } 
    // Nếu nhập qua Excel có link ảnh sẵn
    else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    productData.images = JSON.stringify(imageUrls);
    const product = await productModel.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Lỗi Database:', error.message);
    res.status(400).json({ error: `Lỗi Database: ${error.message}` });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await productModel.getProductById(id);
    if (!existing) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = JSON.stringify(imageUrls);
    }

    const updated = await productModel.updateProduct(id, updateData);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Cập nhật thất bại. Vui lòng kiểm tra dữ liệu.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await productModel.getProductById(id);
    if (!existing) return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });

    await productModel.deleteProduct(id);
    res.json({ success: true, message: 'Đã xóa sản phẩm.' });
  } catch (error) {
    res.status(500).json({ error: 'Xóa thất bại. Sản phẩm có thể đang thuộc về một đơn hàng.' });
  }
}
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
