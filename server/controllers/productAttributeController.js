import * as attributeModel from '../models/productAttributeModel.js'

const allowedTypes = ['category', 'size', 'material']

export async function getAttributes(req, res) {
  try {
    const attributes = await attributeModel.getAllAttributes()
    res.json(attributes)
  } catch (error) {
    console.error('Get Attributes Error:', error.message)
    res.status(500).json({
      error: 'Không thể tải thuộc tính sản phẩm.'
    })
  }
}

export async function createAttribute(req, res) {
  try {
    const { type, name } = req.body

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        error: 'Loại thuộc tính không hợp lệ.'
      })
    }

    if (!name?.trim()) {
      return res.status(400).json({
        error: 'Vui lòng nhập tên thuộc tính.'
      })
    }

    const attribute = await attributeModel.createAttribute({
      type,
      name: name.trim()
    })

    res.status(201).json(attribute)
  } catch (error) {
    console.error('Create Attribute Error:', error.message)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Thuộc tính này đã tồn tại.'
      })
    }

    res.status(400).json({
      error: 'Không thể thêm thuộc tính.'
    })
  }
}

export async function updateAttribute(req, res) {
  try {
    const { id } = req.params
    const { type, name } = req.body

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        error: 'Loại thuộc tính không hợp lệ.'
      })
    }

    if (!name?.trim()) {
      return res.status(400).json({
        error: 'Vui lòng nhập tên thuộc tính.'
      })
    }

    const updated = await attributeModel.updateAttribute(id, {
      type,
      name: name.trim()
    })

    if (!updated) {
      return res.status(404).json({
        error: 'Thuộc tính không tồn tại.'
      })
    }

    res.json(updated)
  } catch (error) {
    console.error('Update Attribute Error:', error.message)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Thuộc tính này đã tồn tại.'
      })
    }

    res.status(400).json({
      error: 'Không thể cập nhật thuộc tính.'
    })
  }
}

export async function deleteAttribute(req, res) {
  try {
    const deleted = await attributeModel.deleteAttribute(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        error: 'Thuộc tính không tồn tại.'
      })
    }

    res.json({
      success: true,
      message: 'Đã xóa thuộc tính.'
    })
  } catch (error) {
    console.error('Delete Attribute Error:', error.message)
    res.status(400).json({
      error: 'Không thể xóa thuộc tính.'
    })
  }
}