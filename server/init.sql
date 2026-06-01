DROP DATABASE IF EXISTS phuonganh_rope;

CREATE DATABASE phuonganh_rope
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE phuonganh_rope;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer',
  address TEXT,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('category', 'size', 'material') NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_type_name (type, name)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  size DECIMAL(10,2) NOT NULL COMMENT 'Đơn vị mét',
  material VARCHAR(100) NOT NULL,
  weight_kg DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit VARCHAR(20) NOT NULL DEFAULT 'cuộn',
  price DECIMAL(15,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_variant (product_id, category, size, material)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  note TEXT,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','shipping','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  variant_id INT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(15,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

INSERT INTO users (full_name, email, phone, password, role, address)
VALUES
('Admin Phương Anh', 'admin@phuonganh.com', '0901000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'admin', 'Xưởng Phương Anh'),
('Staff Phương Anh', 'staff@phuonganh.com', '0902000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'staff', 'Xưởng Phương Anh'),
('Khách hàng', 'customer@example.com', '0903000000', '$2a$10$7r1B9Y/2yFN/9dnfLgMvO.lR5M6jGpAgE06D.gWkUePaA7lc/DvQW', 'customer', 'Hà Nội, Việt Nam');

INSERT INTO product_attributes (type, name) VALUES
('category', 'Dây neo tàu'),
('category', 'Dây PP'),
('category', 'Dây PE'),
('category', 'Dây dù'),
('category', 'Lưới đánh cá'),
('category', 'Phụ kiện ngư nghiệp'),
('category', 'Khác'),
('size', '50'),
('size', '100'),
('size', '150'),
('size', '200'),
('size', '250'),
('size', '300'),
('material', 'PP'),
('material', 'PE'),
('material', 'Nylon'),
('material', 'Polyester'),
('material', 'Nhựa tổng hợp');

INSERT INTO products (name, description, images)
VALUES
(
  'Dây PP chịu lực',
  'Dây PP bền chắc, phù hợp dùng trong ngư nghiệp, buộc neo và kéo lưới.',
  JSON_ARRAY('https://images.unsplash.com/photo-1569180884778-44f8d7434b81?auto=format&fit=crop&w=900&q=80')
),
(
  'Dây PE chống nắng',
  'Dây PE chống tia UV, nhẹ, bền, phù hợp môi trường biển.',
  JSON_ARRAY('https://images.unsplash.com/photo-1520118739459-22ca03e10326?auto=format&fit=crop&w=900&q=80')
);

-- Giá = weight_kg * 100000
INSERT INTO product_variants
(product_id, category, size, material, weight_kg, unit, price, stock)
VALUES
(1, 'Dây PP', 100, 'PP', 30, 'cuộn', 3000000, 20),
(1, 'Dây PP', 150, 'PP', 50, 'cuộn', 5000000, 40),
(1, 'Dây PP', 200, 'PP', 70, 'cuộn', 7000000, 30),
(1, 'Dây PP', 150, 'Nylon', 45, 'cuộn', 4500000, 18),

(2, 'Dây PE', 100, 'PE', 40, 'cuộn', 4000000, 25),
(2, 'Dây PE', 200, 'PE', 70, 'cuộn', 7000000, 30),
(2, 'Dây PE', 300, 'PE', 100, 'cuộn', 10000000, 12);

DESCRIBE products;
DESCRIBE product_variants;
SELECT * FROM products;
SELECT * FROM product_variants;