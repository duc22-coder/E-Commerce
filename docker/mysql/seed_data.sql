-- Seed Data for E-commerce Application
USE ecommerce_db;

-- 1. Insert Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest gadgets, smartphones, laptops, and more.'),
('Fashion', 'Trendy clothing and apparel for men and women.'),
('Home & Living', 'Furniture, decor, and kitchen essentials.'),
('Footwear', 'Stylish and comfortable shoes for every occasion.'),
('Accessories', 'Watches, bags, and jewelry to complete your look.');

-- 2. Insert Test Users
-- Note: Password for both is 'password123' (BCrypt hashed)
INSERT INTO users (email, password, first_name, last_name, phone, enabled) VALUES
('admin@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'System', 'Admin', '1234567890', 1),
('user@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'John', 'Doe', '0987654321', 1);

-- 3. Assign Roles
-- Admin user gets both ROLE_USER and ROLE_ADMIN
-- Assuming IDs 1 and 2 for roles and users based on insertion order
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin get ROLE_USER
(1, 2), -- admin get ROLE_ADMIN
(2, 1); -- user get ROLE_USER

-- 4. Insert Products
INSERT INTO products (name, description, price, stock_quantity, brand, category_id) VALUES
('iPhone 15 Pro', 'Apple iPhone 15 Pro with Titanium design and A17 Pro chip.', 999.00, 50, 'Apple', 1),
('MacBook Air M2', '13-inch MacBook Air with M2 chip, 8GB RAM, 256GB SSD.', 1099.00, 30, 'Apple', 1),
('Sony WH-1000XM5', 'Industry-leading noise-canceling headphones.', 348.00, 100, 'Sony', 1),
('Classic White T-Shirt', 'Premium cotton crew neck t-shirt for daily wear.', 25.00, 500, 'CottonOn', 2),
('Slim Fit Denim Jeans', 'Dark wash slim fit jeans with slight stretch.', 55.00, 200, 'Levi''s', 2),
('Leather Running Shoes', 'High-performance running shoes with breathable mesh.', 85.00, 150, 'Nike', 4),
('Minimalist Wall Clock', 'Sleek wooden wall clock for modern home decor.', 45.00, 80, 'HomeDecor', 3),
('Stainless Steel Water Bottle', 'Vacuum insulated 1-liter water bottle.', 18.00, 300, 'Hydrate', 3),
('Luxury Leather Watch', 'Elegant analog watch with genuine leather strap.', 120.00, 60, 'Timex', 5),
('Canvas Laptop Backpack', 'Durable backpack with padded laptop sleeve.', 40.00, 120, 'BagCo', 5);

-- 5. Insert Product Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1696446701796-da61225697cc', 1),
(2, 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237', 1),
(3, 'https://images.unsplash.com/photo-1618366712277-7070430238c0', 1),
(4, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1),
(5, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 1),
(6, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 1),
(7, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c', 1),
(8, 'https://images.unsplash.com/photo-1602143399827-bd934344c5c1', 1),
(9, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314', 1),
(10, 'https://images.unsplash.com/photo-1553062407-98eebcf4c9a1', 1);

-- 6. Insert Product Sizes (for Clothing and Footwear)
INSERT INTO product_sizes (product_id, size_name) VALUES
(4, 'S'), (4, 'M'), (4, 'L'), (4, 'XL'),
(5, '30'), (5, '32'), (5, '34'), (5, '36'),
(6, '8'), (6, '9'), (6, '10'), (6, '11');

-- 7. Insert Initial Reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Amazing phone! The camera is incredible.'),
(2, 2, 4, 'Very light and fast. Perfect for my work.'),
(3, 2, 5, 'Best headphones I have ever owned.');
