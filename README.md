⚓ Phương Anh Rope ShopHệ thống thương mại điện tử toàn diện cho cửa hàng dây thừng hàng hải Phương Anh. Dự án tích hợp đầy đủ tính năng mua sắm, quản lý đơn hàng và phân quyền người dùng (RBAC).✨ Tính năng nổi bật👤 Khách hàng (Customer)Mua sắm: Duyệt danh mục sản phẩm, tìm kiếm và xem chi tiết.Giỏ hàng: Thêm/sửa/xóa sản phẩm, tính toán tổng tiền tự động.Thanh toán: Quy trình đặt hàng nhanh chóng.Cá nhân: Đăng ký/Đăng nhập (JWT), quản lý lịch sử đơn hàng và hồ sơ cá nhân.🛠️ Quản trị viên (Admin)Dashboard: Thống kê doanh thu và phân tích tăng trưởng.Quản lý kho: Thêm, sửa, xóa sản phẩm và cập nhật số lượng tồn kho.Người dùng: Quản lý danh sách tài khoản và phân quyền (Admin/Staff/Customer).📋 Nhân viên (Staff)Vận đơn: Theo dõi danh sách đơn hàng toàn hệ thống.Trạng thái: Cập nhật tiến độ đơn hàng (Chờ xử lý -> Đang giao -> Hoàn thành).💻 Tech StackFrontend: React 18, Vite, React Router, TailwindCSS, Axios.Backend: Node.js, Express.js, JWT (JSON Web Token).Database: MySQL 8.0.Security: Bcrypt (Hashing password), Role-based Middleware.📁 Cấu trúc dự ánPlaintextfrontend/                # React Application (Vite)
└── src/
    ├── components/      # UI Reusable components
    ├── pages/           # Page containers
    ├── services/        # Axios API instances
    └── layouts/         # Main & Admin layouts
server/                  # Node.js API
├── config/              # Database & Environment config
├── controllers/         # Logic xử lý Request
├── middleware/          # Kiểm tra Token & Phân quyền
├── models/              # Truy vấn cơ sở dữ liệu
└── routes/              # Định nghĩa các API endpoints
🚀 Hướng dẫn cài đặt1. Chuẩn bịNode.js 18+.MySQL 8.0+.2. Thiết lập Cơ sở dữ liệuMở MySQL Terminal hoặc Workbench và chạy lệnh:SQLCREATE DATABASE phuonganh_rope;
Lưu ý: Import file server/init.sql để khởi tạo bảng và dữ liệu mẫu.3. Cấu hình BackendBashcd server
npm install
cp .env.example .env # Cập nhật thông tin DB_USER, DB_PASSWORD
npm run dev
Server chạy tại: http://localhost:5000 (hoặc cấu hình tùy chỉnh).4. Cấu hình FrontendBashcd frontend
npm install
npm run dev
App chạy tại: http://localhost:5173.🔐 Tài khoản thử nghiệmVai tròEmailMật khẩuAdminadmin@phuonganh.comadmin123Staffstaff@phuonganh.compasswordCustomercustomer@example.compassword🛠 API Endpoints (Sơ lược)Auth & User:POST /api/auth/login - Đăng nhập nhận JWT.GET /api/auth/profile - Lấy thông tin cá nhân (Yêu cầu Token).Sản phẩm & Đơn hàng:GET /api/products - Danh sách sản phẩm (Công khai).POST /api/orders - Tạo đơn hàng mới (Chỉ Customer).PUT /api/orders/:id - Cập nhật trạng thái đơn hàng (Admin/Staff).📝 Lưu ýHình ảnh sản phẩm được lưu trữ cục bộ tại server/uploads/.Token JWT có thời hạn hết hạn là 7 ngày.Mật khẩu được mã hóa một chiều bằng thư viện bcrypt.Phát triển bởi yesaduck - 2026
