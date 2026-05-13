import * as productModel from '../models/productModel.js'

function parseImages(bodyImages, files = []) {
  const uploaded = files.map((file) => `/uploads/${file.filename}`)

  let existing = []

  if (bodyImages) {
    if (Array.isArray(bodyImages)) {
      existing = bodyImages
    } else if (typeof bodyImages === 'string') {
      try {
        const parsed = JSON.parse(bodyImages)
        existing = Array.isArray(parsed) ? parsed : [bodyImages]
      } catch {
        existing = [bodyImages]
      }
    }
  }

  return [...existing, ...uploaded].filter(Boolean)
}

export async function getProducts(req, res) {
  try {
    const result = await productModel.getAllProducts(req.query)
    res.json(result)
  } catch (error) {
    console.error('Get Products Error:', error.message)
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' })
  }
}

export async function getProduct(req, res) {
  try {
    const product = await productModel.getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
    }

    res.json(product)
  } catch (error) {
    console.error('Get Product Error:', error.message)
    res.status(500).json({ error: 'Lỗi server.' })
  }
}

export async function createProduct(req, res) {
  try {
    const price = Number(req.body.price || 0)

    if (!req.body.name?.trim()) {
      return res.status(400).json({ error: 'Tên sản phẩm là bắt buộc!' })
    }

    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Giá sản phẩm không hợp lệ!' })
    }

    const productData = {
      ...req.body,
      price,
      stock: Number(req.body.stock || 0),
      images: parseImages(req.body.images, req.files)
    }

    const product = await productModel.createProduct(productData)

    res.status(201).json(product)
  } catch (error) {
    console.error('Create Product Error:', error.message)
    res.status(400).json({ error: `Lỗi Database: ${error.message}` })
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const existing = await productModel.getProductById(id)

    if (!existing) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
    }

    const images = parseImages(req.body.images, req.files)

    const updateData = {
      ...req.body,
      price: Number(req.body.price || 0),
      stock: Number(req.body.stock || 0),
      images
    }

    const updated = await productModel.updateProduct(id, updateData)

    res.json(updated)
  } catch (error) {
    console.error('Update Product Error:', error.message)
    res.status(400).json({
      error: 'Cập nhật thất bại. Vui lòng kiểm tra dữ liệu.'
    })
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params
    const existing = await productModel.getProductById(id)

    if (!existing) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
    }

    await productModel.deleteProduct(id)

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm.'
    })
  } catch {
    res.status(500).json({
      error: 'Xóa thất bại. Sản phẩm có thể đang thuộc về một đơn hàng.'
    })
  }
}