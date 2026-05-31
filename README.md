# 🛒 E-Commerce Backend API

> **Enterprise E-commerce RESTful API** xây dựng bằng **Spring Boot 3**, bảo mật bằng **JWT**, kết nối **MySQL**, hỗ trợ triển khai qua **Docker Compose**.

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc dự án](#-kiến-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [API Endpoints](#-api-endpoints)
- [Phân quyền](#-phân-quyền)


---

## 🌟 Tổng quan

Dự án này là một **backend RESTful API** phục vụ cho hệ thống thương mại điện tử. API cung cấp đầy đủ các chức năng:

- Xác thực & phân quyền người dùng (JWT)
- Quản lý sản phẩm, danh mục
- Giỏ hàng và đặt hàng
- Upload ảnh sản phẩm
- Tích hợp tài liệu API tự động qua Swagger UI

---

## 🧰 Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | Java 17 |
| Framework | Spring Boot 3.2.4 |
| Bảo mật | Spring Security + JWT (JJWT 0.12.5) |
| ORM | Spring Data JPA / Hibernate |
| Cơ sở dữ liệu | MySQL 8.0 |
| Build tool | Apache Maven |
| Tài liệu API | SpringDoc OpenAPI (Swagger UI) |
| Containerization | Docker & Docker Compose |
| Utilities | Lombok, Spring Validation, Spring Actuator |

---

## 🏗 Kiến trúc dự án

```
backend/
└── src/main/java/com/ecommerce/api/
    ├── config/          # Cấu hình CORS, WebMvc, v.v.
    ├── controller/      # REST API Controllers
    │   ├── AuthController.java        # Đăng nhập / Đăng ký
    │   ├── ProductController.java     # Quản lý sản phẩm
    │   ├── CategoryController.java    # Quản lý danh mục
    │   ├── CartController.java        # Giỏ hàng
    │   ├── OrderController.java       # Đặt hàng
    │   ├── UploadController.java      # Upload ảnh
    │   └── UserController.java        # Thông tin người dùng
    ├── dto/             # Data Transfer Objects
    ├── entity/          # JPA Entities (User, Product, Order, ...)
    ├── exception/       # Global Exception Handling
    ├── repository/      # Spring Data JPA Repositories
    ├── security/        # JWT Filter, UserDetailsService, SecurityConfig
    └── service/         # Business Logic (interface + impl)
```

---

## ⚙️ Yêu cầu hệ thống

- **Java 17+**
- **Maven 3.8+**
- **MySQL 8.0** 
- **Docker & Docker Compose**

---

## 🚀 Cài đặt & Khởi chạy

### ✅ Cách 1: Dùng Docker Compose 

Chạy toàn bộ ứng dụng (backend + MySQL) chỉ với một lệnh:

```bash
docker-compose up --build
```

> API sẽ chạy tại: `http://localhost:8080`
> MySQL sẽ chạy tại: `localhost:3306`

Để dừng:

```bash
docker-compose down
```

---

### ✅ Cách 2: Chạy thủ công (Local)

**Bước 1:** Khởi động MySQL và tạo database:

```sql
CREATE DATABASE ecommerce_db;
```

**Bước 2:** Cấu hình kết nối DB trong `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: [PASSWORD]
```

**Bước 3:** Build và chạy ứng dụng:

```bash
cd backend
mvn clean spring-boot:run
```

> API sẽ khởi động tại: `http://localhost:8080`

---

## 👤 Tài khoản mặc định

Sau khi khởi chạy, hệ thống được seed sẵn 2 tài khoản demo:

### 🔴 Admin — Toàn quyền quản trị

| Trường | Giá trị |
|---|---|
| **Email** | `admin@ecommerce.com` |
| **Password** | `password123` |
| **Vai trò** | `ROLE_USER` + `ROLE_ADMIN` |

### 🟢 User — Người dùng thường

| Trường | Giá trị |
|---|---|
| **Email** | `user@ecommerce.com` |
| **Password** | `password123` |
| **Vai trò** | `ROLE_USER` |

---

## 🔑 Cách đăng nhập & sử dụng token

### Bước 1 — Đăng nhập để lấy JWT token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "admin@ecommerce.com",
  "firstName": "System",
  "lastName": "Admin",
  "roles": ["ROLE_USER", "ROLE_ADMIN"]
}
```

### Bước 2 — Gắn token vào header cho các request tiếp theo

```http
Authorization: Bearer <token_nhận_được>
```

**Ví dụ — Lấy danh sách tất cả đơn hàng (chỉ Admin):**

```http
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 📡 API Endpoints

### 🔓 Xác thực (Public)

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth/login` | Đăng nhập, trả về JWT |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới |

### 📦 Sản phẩm

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/products` | Public | Lấy tất cả sản phẩm |
| `GET` | `/api/products?keyword={kw}` | Public | Tìm kiếm sản phẩm |
| `GET` | `/api/products?categoryId={id}` | Public | Lọc theo danh mục |
| `GET` | `/api/products/{id}` | Public | Chi tiết sản phẩm |
| `POST` | `/api/products` | **ADMIN** | Tạo sản phẩm mới |
| `PUT` | `/api/products/{id}` | **ADMIN** | Cập nhật sản phẩm |
| `DELETE` | `/api/products/{id}` | **ADMIN** | Xóa sản phẩm |

### 🗂 Danh mục

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Lấy tất cả danh mục |
| `GET` | `/api/categories/{id}` | Public | Chi tiết danh mục |
| `POST` | `/api/categories` | **ADMIN** | Tạo danh mục mới |
| `PUT` | `/api/categories/{id}` | **ADMIN** | Cập nhật danh mục |
| `DELETE` | `/api/categories/{id}` | **ADMIN** | Xóa danh mục |

### 🛒 Giỏ hàng

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/cart` | User | Xem giỏ hàng |
| `POST` | `/api/cart/items?productId={id}&quantity={n}` | User | Thêm sản phẩm |
| `PUT` | `/api/cart/items/{itemId}?quantity={n}` | User | Cập nhật số lượng |
| `DELETE` | `/api/cart/items/{itemId}` | User | Xóa 1 sản phẩm |
| `DELETE` | `/api/cart` | User | Xóa toàn bộ giỏ hàng |

### 📋 Đơn hàng

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/orders` | User | Đặt hàng |
| `GET` | `/api/orders/my-orders` | User | Đơn hàng của tôi |
| `GET` | `/api/orders/{id}` | User | Chi tiết đơn hàng |
| `GET` | `/api/orders` | **ADMIN** | Xem tất cả đơn hàng |
| `PATCH` | `/api/orders/{id}/status?status={status}` | **ADMIN** | Cập nhật trạng thái đơn |

**Các trạng thái đơn hàng:** `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED` | `CANCELLED`

### 🖼 Upload ảnh

| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/upload` | User | Upload file ảnh (max 5MB) |

---

## 🛡 Phân quyền

| Vai trò | Quyền hạn |
|---|---|
| **ROLE_ADMIN** | Toàn quyền: quản lý sản phẩm, danh mục, xem & cập nhật tất cả đơn hàng |
| **ROLE_USER** | Xem sản phẩm, quản lý giỏ hàng, đặt hàng, xem đơn hàng của mình |
| **Public** | Xem danh sách sản phẩm, danh mục, đăng ký / đăng nhập |

---

---

## 🗃 Cơ sở dữ liệu

- **DB name:** `ecommerce_db`
- **Host mặc định:** `localhost:3306`
- **User:** `root` / **Password:** [PASSWORD]`
- Schema được tự động tạo bởi Hibernate (`ddl-auto: update`)

---

