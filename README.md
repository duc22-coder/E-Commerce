# 🛒 E-Commerce Full-Stack App

> Spring Boot 3 + React · JWT Auth · MySQL · Docker Compose

---

## 🧰 Tech Stack

| Layer | Công nghệ |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security + JWT |
| Frontend | React (Vite), TailwindCSS |
| Database | MySQL 8.0, Spring Data JPA / Hibernate |
| DevOps | Docker & Docker Compose |
| Docs | Swagger UI (SpringDoc OpenAPI) |

---

## 🚀 Khởi chạy

### Docker (khuyến nghị)

```bash
docker-compose up --build
```

- API: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- MySQL: `localhost:3306`

### Thủ công

```bash
# Backend
cd backend && mvn clean spring-boot:run

# Frontend
cd frontend && npm install && npm run dev
```

> Tạo DB trước: `CREATE DATABASE ecommerce_db;`  
> Cấu hình `application.yml` với username/password MySQL của bạn.

---

## 👤 Tài khoản demo

| Vai trò | Email | Password |
|---|---|---|
| Admin | `admin@ecommerce.com` | `admin123` |
| User | `user@ecommerce.com` | `password123` |

---

## 📡 API Endpoints

### Auth (Public)
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth/login` | Đăng nhập → JWT |
| `POST` | `/api/auth/register` | Đăng ký |

### Sản phẩm
| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/products` | Public |
| `GET` | `/api/products/{id}` | Public |
| `POST/PUT/DELETE` | `/api/products` | Admin |

### Danh mục
| Method | Endpoint | Quyền |
|---|---|---|
| `GET` | `/api/categories` | Public |
| `POST/PUT/DELETE` | `/api/categories` | Admin |

### Giỏ hàng & Đơn hàng
| Method | Endpoint | Quyền |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/api/cart` | User |
| `POST` | `/api/orders` | User |
| `GET` | `/api/orders/my-orders` | User |
| `GET/PATCH` | `/api/orders` | Admin |

> Order status flow: `PENDING → PROCESSING → SHIPPED → DELIVERED` \| `CANCELLED`

---

## 🛡 Phân quyền

| Vai trò | Quyền |
|---|---|
| **ADMIN** | Toàn quyền quản lý sản phẩm, danh mục, đơn hàng |
| **USER** | Giỏ hàng, đặt hàng, xem đơn của mình |
| **Không cần đăng nhập** | `GET /api/products/**`, `GET /api/categories/**`, `/api/auth/**` |

> 💡 "Không cần đăng nhập" không phải tài khoản — đây là các route được `.permitAll()` trong `SecurityConfig`, ai cũng gọi được mà không cần JWT.
  