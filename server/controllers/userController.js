import * as userModel from '../models/userModel.js'

export async function getUsers(req, res) {
  const users = await userModel.getAllUsers()
  res.json(users)
}

export async function getUser(req, res) {
  const { id } = req.params
  const user = await userModel.getUserById(id)
  if (!user) {
    return res.status(404).json({ error: 'Người dùng không tồn tại.' })
  }
  res.json(user)
}

export async function updateUser(req, res) {
  const { id } = req.params
  const user = await userModel.getUserById(id)
  if (!user) {
    return res.status(404).json({ error: 'Người dùng không tồn tại.' })
  }
  const updated = await userModel.updateUser(id, req.body)
  res.json(updated)
}

export async function deleteUser(req, res) {
  const { id } = req.params
  await userModel.deleteUser(id)
  res.json({ success: true })
}
