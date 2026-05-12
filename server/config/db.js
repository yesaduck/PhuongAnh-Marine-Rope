<<<<<<< HEAD
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phuonganh_rope',
=======
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
<<<<<<< HEAD
})

export default pool
=======
});

// Kiểm tra kết nối database ngay khi start server
pool.getConnection()
  .then(connection => {
    console.log('✅ Kết nối Database MySQL thành công!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối Database:', err.message);
  });

export default pool;
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
