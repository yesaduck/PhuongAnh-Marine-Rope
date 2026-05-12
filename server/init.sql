DROP DATABASE IF EXISTS phuonganh_rope;
CREATE DATABASE phuonganh_rope CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE phuonganh_rope;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer','admin','staff') NOT NULL DEFAULT 'customer',
  address TEXT,
<<<<<<< HEAD
=======
  avatar VARCHAR(255),
>>>>>>> 5ea6ccf (feat: hoàn thiện giao diện admin, client và fix lỗi import excel)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  size VARCHAR(100),
  material VARCHAR(100),
  stock INT NOT NULL DEFAULT 0,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  note TEXT,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','shipping','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

INSERT INTO users (full_name, email, phone, password, role, address)
VALUES
  ('Admin Phuong Anh', 'admin@phuonganh.com', '0901000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'admin', 'Xưởng Phương Anh, Việt Nam'),
  ('Staff Phuong Anh', 'staff@phuonganh.com', '0902000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'staff', 'Xưởng Phương Anh, Việt Nam'),
  ('Khách hàng', 'customer@example.com', '0903000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'customer', 'Hà Nội, Việt Nam');

INSERT INTO products (name, description, category, price, size, material, stock, images)
VALUES
  ('Dây neo tàu 20mm', 'Dây neo tàu bền bỉ, chịu tải cao phù hợp neo đậu tàu nhỏ và vừa.', 'Dây neo tàu', 150000, '20mm', 'PP', 120, JSON_ARRAY('https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80')),
  ('Dây PP chịu lực', 'Dây PP chuyên dùng trong ngư nghiệp, chống mài mòn tốt và an toàn.', 'Dây PP', 80000, '10mm', 'PP', 200, JSON_ARRAY('https://images.unsplash.com/photo-1569180884778-44f8d7434b81?auto=format&fit=crop&w=900&q=80')),
  ('Dây PE chống nắng', 'Dây PE nhẹ, mềm mại, chống UV và đảm bảo độ bền cao trong môi trường biển.', 'Dây PE', 95000, '12mm', 'PE', 160, JSON_ARRAY('https://images.unsplash.com/photo-1520118739459-22ca03e10326?auto=format&fit=crop&w=900&q=80')),
  ('Dây dù đa năng', 'Dây dù phong cách, sử dụng cho nhiều mục đích với độ bền và khả năng chịu lực tốt.', 'Dây dù', 65000, '8mm', 'Nylon', 180, JSON_ARRAY('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80')),
  ('Lưới đánh cá chuyên dụng', 'Lưới đánh cá chất lượng, lưới mắt nhỏ và dẻo dai, phù hợp nhiều loại cá.', 'Lưới', 220000, '2m x 3m', 'Nylon', 80, JSON_ARRAY('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'));
