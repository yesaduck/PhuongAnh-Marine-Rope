import pool from '../config/db.js'
import bcrypt from 'bcryptjs'

async function reset() {
  try {
    const pwd = 'Password123!'
    const hash = await bcrypt.hash(pwd, 10)
    const [res] = await pool.query("UPDATE users SET password = ? WHERE email IN ('admin@phuonganh.com','staff@phuonganh.com','customer@example.com')", [hash])
    console.log('Updated rows:', res.affectedRows)
    console.log('New password for test accounts:', pwd)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

reset()
