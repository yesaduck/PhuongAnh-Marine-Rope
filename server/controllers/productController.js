import * as productModel from '../models/productModel.js'

function parseImages(bodyImages, files = []) {
  const uploaded = files.map((file) => `/uploads/${file.filename}`)
  let existing = []

  if (bodyImages) {
    if (Array.isArray(bodyImages)) {
      existing = bodyImages
    } else {
      try {
        const parsed = JSON.parse(bodyImages)
        existing = Array.isArray(parsed) ? parsed : [bodyImages]
      } catch {
        existing = [bodyImages]
      }
    }
  }

  return [...uploaded, ...existing].filter(Boolean)
}

function parseVariants(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function buildProductData(req) {
  return {
    name: req.body.name?.trim(),
    description: req.body.description || '',
    images: parseImages(req.body.images, req.files),
    variants: parseVariants(req.body.variants)
  }
}

function validateProduct(data) {
  if (!data.name) return 'Tên sản phẩm là bắt buộc.'
  if (!data.variants.length) return 'Vui lòng thêm ít nhất 1 biến thể sản phẩm.'

  for (const variant of data.variants) {
    if (!variant.category || !variant.size || !variant.material) {
      return 'Biến thể phải có danh mục, kích thước và chất liệu.'
    }

    if (Number(variant.weight_kg || 0) <= 0) {
      return 'Trọng lượng biến thể phải lớn hơn 0.'
    }

    if (Number(variant.stock || 0) < 0) {
      return 'Tồn kho không hợp lệ.'
    }
  }

  return ''
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
    const data = buildProductData(req)
    const error = validateProduct(data)

    if (error) {
      return res.status(400).json({ error })
    }

    const product = await productModel.createProduct(data)
    res.status(201).json(product)
  } catch (error) {
    console.error('Create Product Error:', error.message)
    res.status(400).json({ error: `Lỗi Database: ${error.message}` })
  }
}

export async function updateProduct(req, res) {
  try {
    const existing = await productModel.getProductById(req.params.id)

    if (!existing) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
    }

    const data = buildProductData(req)
    const error = validateProduct(data)

    if (error) {
      return res.status(400).json({ error })
    }

    const updated = await productModel.updateProduct(req.params.id, data)
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
    const existing = await productModel.getProductById(req.params.id)

    if (!existing) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại.' })
    }

    await productModel.deleteProduct(req.params.id)

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