# DỰ ÁN: WEBSITE THƯƠNG MẠI ĐIỆN TỬ PHƯƠNG ANH ROPE

## 1. Giới thiệu dự án

Phương Anh Rope Shop là hệ thống thương mại điện tử được xây dựng nhằm hỗ trợ cửa hàng dây thừng ngư nghiệp quản lý sản phẩm, đơn hàng và khách hàng trên nền tảng trực tuyến.

Hệ thống cho phép khách hàng tìm kiếm sản phẩm, đặt hàng online, theo dõi lịch sử mua hàng. Đồng thời hỗ trợ nhân viên và quản trị viên quản lý sản phẩm, đơn hàng và người dùng thông qua hệ thống phân quyền.

---

📁 Cấu trúc dự án
PhuongAnh-Rope-Shop/
│
├── frontend/                          # React Application (Vite)
│   ├── public/
│   │
│   └── src/
│       ├── assets/                    # Hình ảnh, icon, logo
│       │
│       ├── components/                # Component dùng lại
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   ├── SearchBar.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       ├── layouts/                   # Layout hệ thống
│       │   ├── MainLayout.jsx
│       │   └── AdminLayout.jsx
│       │
│       ├── pages/                     # Các trang giao diện
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── MyOrders.jsx
│       │   ├── Profile.jsx
│       │   ├── Contact.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminProducts.jsx
│       │   ├── AdminOrders.jsx
│       │   └── AdminUsers.jsx
│       │
│       ├── services/                  # Gọi API Backend
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── productService.js
│       │   ├── orderService.js
│       │   ├── cartService.js
│       │   ├── uploadService.js
│       │   └── contactService.js
│       │
│       ├── hooks/                     # Custom Hooks
│       │
│       ├── utils/                     # Hàm tiện ích
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── server/                            # NodeJS + Express API
│   │
│   ├── config/
│   │   ├── db.js                      # Kết nối MySQL
│   │   └── firebase.js                # Firebase Config
│   │
│   ├── controllers/                   # Xử lý Request
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── uploadController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT Verify
│   │   ├── roleMiddleware.js          # RBAC
│   │   └── uploadMiddleware.js
│   │
│   ├── models/                        # Truy vấn Database
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   └── productAttributeModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── userRoutes.js
│   │   └── productAttributeRoutes.js
│   │
│   ├── uploads/                       # Ảnh sản phẩm upload
│   │
│   ├── init.sql                       # Database Script
│   ├── app.js
│   └── server.js
│
├── database/
│   └── phuonganh_rope.sql
│
├── README.md
├── package.json
└── .env
🏗 Kiến trúc hệ thống

Frontend (ReactJS)
↓ Axios REST API
Backend (NodeJS + ExpressJS)
↓
MySQL Database

Authentication:

JWT Token
Google Login (Firebase Authentication)

Authorization:

Admin
Staff
Customer

Storage:

Local Uploads (server/uploads)
## 2. Mục tiêu dự án

* Xây dựng website bán hàng trực tuyến chuyên nghiệp.
* Tối ưu quy trình đặt hàng cho khách hàng.
* Quản lý sản phẩm và tồn kho hiệu quả.
* Theo dõi trạng thái đơn hàng theo thời gian thực.
* Phân quyền người dùng theo từng vai trò.

---

## 3. Chức năng chính

### Khách hàng (Customer)

* Đăng ký tài khoản.
* Đăng nhập bằng Email hoặc Google.
* Xem danh sách sản phẩm.
* Xem chi tiết sản phẩm.
* Tìm kiếm sản phẩm.
* Thêm sản phẩm vào giỏ hàng.
* Đặt hàng trực tuyến.
* Xem lịch sử đơn hàng.
* Quản lý thông tin cá nhân.

### Nhân viên (Staff)

* Xem danh sách đơn hàng.
* Theo dõi trạng thái đơn hàng.
* Cập nhật trạng thái giao hàng.
* Xác nhận đơn hàng.

### Quản trị viên (Admin)

* Dashboard thống kê.
* Quản lý sản phẩm (CRUD).
* Upload hình ảnh sản phẩm.
* Quản lý tồn kho.
* Quản lý tài khoản người dùng.
* Phân quyền hệ thống.

---

## 4. Công nghệ sử dụng

### Frontend

* ReactJS 18
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React Icons
* React Hot Toast

### Backend

* NodeJS
* ExpressJS
* JWT Authentication
* Bcrypt Password Hashing
* Multer Upload File

### Database

* MySQL 8.0

### Authentication & Security

* JSON Web Token (JWT)
* Role-Based Access Control (RBAC)
* Password Hashing bằng Bcrypt

### Công cụ phát triển

* Visual Studio Code
* MySQL Workbench
* Postman
* GitHub
* Git

---

## 5. Kiến trúc hệ thống

Frontend ReactJS giao tiếp với Backend ExpressJS thông qua REST API.

Backend xử lý:

* Xác thực người dùng.
* Phân quyền.
* Quản lý sản phẩm.
* Quản lý đơn hàng.
* Kết nối MySQL.

Hình ảnh sản phẩm được lưu tại thư mục uploads trên Server.

---

## 6. Kết quả đạt được

* Hoàn thiện hệ thống thương mại điện tử Fullstack.
* Triển khai thành công đăng nhập JWT.
* Xây dựng hệ thống phân quyền Admin/Staff/Customer.
* Thiết kế giao diện Responsive cho Desktop và Mobile.
* Tích hợp giỏ hàng và thanh toán.
* Quản lý đơn hàng và lịch sử mua hàng.
* Upload và hiển thị hình ảnh sản phẩm từ Server.

---

## 7. Vai trò thực hiện

Fullstack Developer

Công việc thực hiện:

* Thiết kế giao diện ReactJS.
* Xây dựng REST API với ExpressJS.
* Thiết kế cơ sở dữ liệu MySQL.
* Xây dựng chức năng đăng nhập JWT.
* Phân quyền hệ thống.
* Xây dựng chức năng giỏ hàng và đặt hàng.
* Tối ưu UI/UX cho Web và Mobile.
