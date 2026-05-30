package com.ecommerce.api.config;

import com.ecommerce.api.entity.Category;
import com.ecommerce.api.entity.Product;
import com.ecommerce.api.entity.ProductImage;
import com.ecommerce.api.entity.ProductSize;
import com.ecommerce.api.entity.Role;
import com.ecommerce.api.entity.User;
import com.ecommerce.api.repository.CategoryRepository;
import com.ecommerce.api.repository.ProductRepository;
import com.ecommerce.api.repository.RoleRepository;
import com.ecommerce.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // ── 1. Ensure roles exist ──────────────────────────────────────────
        Role roleUser = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));
        Role roleAdmin = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));

        // ── 2. Ensure admin account exists with correct BCrypt password ────
        // Password: admin123  (always re-set so the hash is always valid)
        final String ADMIN_EMAIL = "admin@ecommerce.com";
        final String ADMIN_PASSWORD = "admin123";

        User admin = userRepository.findByEmail(ADMIN_EMAIL).orElseGet(() -> {
            User u = new User();
            u.setEmail(ADMIN_EMAIL);
            u.setFirstName("System");
            u.setLastName("Admin");
            u.setPhone("1234567890");
            u.setEnabled(true);
            return u;
        });
        // Always encode with BCrypt so it is guaranteed to be correct
        admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(roleUser);
        adminRoles.add(roleAdmin);
        admin.setRoles(adminRoles);
        userRepository.save(admin);
        log.info("Admin account ready: {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD);

        // ── 3. Ensure regular test account exists ─────────────────────────
        final String USER_EMAIL = "user@ecommerce.com";
        final String USER_PASSWORD = "user123";

        User testUser = userRepository.findByEmail(USER_EMAIL).orElseGet(() -> {
            User u = new User();
            u.setEmail(USER_EMAIL);
            u.setFirstName("John");
            u.setLastName("Doe");
            u.setPhone("0987654321");
            u.setEnabled(true);
            return u;
        });
        testUser.setPassword(passwordEncoder.encode(USER_PASSWORD));
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(roleUser);
        testUser.setRoles(userRoles);
        userRepository.save(testUser);
        log.info("Test user account ready: {} / {}", USER_EMAIL, USER_PASSWORD);

        // ── 4. Seed products if the store is nearly empty ─────────────────
        long productCount = productRepository.count();
        log.info("Current product count in database: {}", productCount);

        if (productCount <= 10) {
            log.info("Seeding additional diverse products into the database...");

            // Get existing categories or create them if missing
            Category electronics = categoryRepository.findByName("Electronics")
                    .orElseGet(() -> categoryRepository.save(new Category(null, "Electronics", "Latest gadgets, smartphones, laptops, and more.")));
            Category fashion = categoryRepository.findByName("Fashion")
                    .orElseGet(() -> categoryRepository.save(new Category(null, "Fashion", "Trendy clothing and apparel for men and women.")));
            Category homeLiving = categoryRepository.findByName("Home & Living")
                    .orElseGet(() -> categoryRepository.save(new Category(null, "Home & Living", "Furniture, decor, and kitchen essentials.")));
            Category footwear = categoryRepository.findByName("Footwear")
                    .orElseGet(() -> categoryRepository.save(new Category(null, "Footwear", "Stylish and comfortable shoes for every occasion.")));
            Category accessories = categoryRepository.findByName("Accessories")
                    .orElseGet(() -> categoryRepository.save(new Category(null, "Accessories", "Watches, bags, and jewelry to complete your look.")));

            // 1. Sony PlayStation 5
            createProduct("Sony PlayStation 5",
                    "Next-gen gaming console with ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.",
                    new BigDecimal("499.99"), 45, "Sony", electronics,
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db", null);

            // 2. Dell XPS 13
            createProduct("Dell XPS 13 Laptop",
                    "13.4-inch FHD+ Laptop with Intel Core i7, 16GB RAM, 512GB SSD, Windows 11, and premium aluminum chassis.",
                    new BigDecimal("1299.00"), 20, "Dell", electronics,
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45", null);

            // 3. iPad Pro 11-inch
            createProduct("iPad Pro 11-inch",
                    "Apple iPad Pro with M2 Chip, Liquid Retina display, 128GB storage, Wi-Fi 6E, and ultra-wide front camera.",
                    new BigDecimal("799.00"), 35, "Apple", electronics,
                    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0", null);

            // 4. Hoodie Over-sized Black
            createProduct("Hoodie Over-sized Black",
                    "Heavyweight premium cotton blend oversized hoodie in jet black. Perfect streetwear aesthetic and extra warmth.",
                    new BigDecimal("45.00"), 120, "Zara", fashion,
                    "https://images.unsplash.com/photo-1556821840-3a63f95609a7", Arrays.asList("S", "M", "L", "XL"));

            // 5. Bomber Jacket Green
            createProduct("Bomber Jacket Green",
                    "Classic flight bomber jacket in olive green with orange inner lining, zip pockets, and elastic cuffs.",
                    new BigDecimal("75.00"), 85, "H&M", fashion,
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5", Arrays.asList("M", "L", "XL"));

            // 6. Summer Floral Dress
            createProduct("Summer Floral Dress",
                    "Elegant and light cotton-flowy summer dress for ladies featuring a vintage floral print and adjustable waist straps.",
                    new BigDecimal("65.00"), 60, "Uniqlo", fashion,
                    "https://images.unsplash.com/photo-1595777457583-95e059d581b8", Arrays.asList("S", "M", "L"));

            // 7. Ergonomic Office Chair
            createProduct("Ergonomic Office Chair",
                    "Premium high-back mesh desk chair with adjustable lumbar support, 3D armrests, headrest, and thick seat cushion.",
                    new BigDecimal("189.00"), 25, "Sihoo", homeLiving,
                    "https://images.unsplash.com/photo-1505797149-43b0069ec26b", null);

            // 8. Scented Soy Candle Set
            createProduct("Scented Soy Candle Set",
                    "Therapeutic lavender, eucalyptus, and vanilla hand-poured candles made from 100% natural soy wax.",
                    new BigDecimal("22.00"), 150, "AromaCo", homeLiving,
                    "https://images.unsplash.com/photo-1603006905003-be475563bc59", null);

            // 9. Minimalist Table Lamp
            createProduct("Minimalist Table Lamp",
                    "Warm lighting table lamp with a solid wood base, cream linen shade, and touch control brightness.",
                    new BigDecimal("35.00"), 80, "HomeDecor", homeLiving,
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", null);

            // 10. Nike Air Max Sneakers
            createProduct("Nike Air Max Sneakers",
                    "Ultimate comfort air-cushioned athletic running shoes in sleek black, grey, and vibrant crimson details.",
                    new BigDecimal("130.00"), 90, "Nike", footwear,
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff", Arrays.asList("8", "9", "10", "11"));

            // 11. Classic Leather Boots
            createProduct("Classic Leather Boots",
                    "Sturdy waterproof dark brown genuine leather boots with durable rubber soles and high ankle protection.",
                    new BigDecimal("145.00"), 50, "Timberland", footwear,
                    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0", Arrays.asList("9", "10", "11"));

            // 12. Retro Canvas Sneakers
            createProduct("Retro Canvas Sneakers",
                    "Vintage white low-top canvas skate sneakers with signature side stripe and slip-resistant vulcanized sole.",
                    new BigDecimal("50.00"), 110, "Converse", footwear,
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772", Arrays.asList("8", "9", "10"));

            // 13. Aviator Sunglasses
            createProduct("Aviator Sunglasses",
                    "Classic gold metal frame polarized sunglasses with green G-15 lenses. Timeless design with 100% UV protection.",
                    new BigDecimal("150.00"), 75, "Ray-Ban", accessories,
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f", null);

            // 14. Minimalist Leather Wallet
            createProduct("Minimalist Leather Wallet",
                    "Slim bifold genuine brown leather card holder wallet featuring RFID blocking and quick-access card slots.",
                    new BigDecimal("30.00"), 140, "Fossil", accessories,
                    "https://images.unsplash.com/photo-1614252369475-531eba835eb1", null);

            // 15. Noise-cancelling Earbuds
            createProduct("Noise-cancelling Earbuds",
                    "True wireless Bluetooth earbuds with active noise cancelling, charging case, and 32 hours of premium play time.",
                    new BigDecimal("99.00"), 120, "JBL", accessories,
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df", null);

            log.info("Database seeding successfully completed! Added 15 diverse products.");
        }
    }

    private void createProduct(String name, String description, BigDecimal price, int stock, String brand, Category category, String imageUrl, List<String> sizes) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stock);
        product.setBrand(brand);
        product.setCategory(category);

        // Add image
        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setPrimary(true);
        image.setProduct(product);
        product.getImages().add(image);

        // Add sizes if available
        if (sizes != null) {
            for (String sizeName : sizes) {
                ProductSize size = new ProductSize();
                size.setSizeName(sizeName);
                size.setProduct(product);
                product.getSizes().add(size);
            }
        }

        productRepository.save(product);
    }
}
