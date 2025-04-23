const request = require("supertest");
const app = require("../app");
const { User, Product } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let adminToken, userToken, testProduct;

beforeEach(async () => {
  // Clean up before each test
  await User.destroy({ where: {} });
  await Product.destroy({ where: {} });

  const hashedPassword = bcrypt.hashSync("password123", 10);

  // Create test admin user
  const admin = await User.create({
    name: "Admin Test",
    email: "admin@test.com",
    password: hashedPassword,
    role: "admin",
  });

  // Create test regular user
  const user = await User.create({
    name: "User Test",
    email: "user@test.com",
    password: hashedPassword,
    role: "user",
  });

  // Generate tokens
  adminToken = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET_KEY
  );

  userToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY
  );

  // Create test product
  testProduct = await Product.create({
    name: "Test Product",
    price: 100,
  });
});

describe("Authentication Endpoints", () => {
  describe("POST /api/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/register").send({
        name: "New User",
        email: "new@user.com",
        password: "password123",
        role: "user",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name", "New User");
    });

    it("should fail if email already exists", async () => {
      const res = await request(app).post("/api/register").send({
        name: "Duplicate User",
        email: "admin@test.com", // Using existing email
        password: "password123",
        role: "user",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Email Already Exist!");
    });
  });

  describe("POST /api/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: "admin@test.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("message", "Login successful");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/login").send({
        email: "admin@test.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "email or password invalid");
    });
  });
});

describe("Product Endpoints", () => {
  describe("GET /api/products", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a single product", async () => {
      const res = await request(app).get(`/api/products/${testProduct.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("id", testProduct.id);
    });

    it("should return 404 for non-existent product", async () => {
      const res = await request(app).get("/api/products/9999");

      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /api/products", () => {
    it("should create a product when admin", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Product",
          price: 200,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("name", "New Product");
    });

    it("should fail when not admin", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "New Product",
          price: 200,
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product when admin", async () => {
      const res = await request(app)
        .put(`/api/products/${testProduct.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          price: 150,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("price", 150);
    });

    it("should fail when not admin", async () => {
      const res = await request(app)
        .put(`/api/products/${testProduct.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          price: 150,
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product when admin", async () => {
      const product = await Product.create({
        name: "To Delete",
        price: 100,
      });

      const res = await request(app)
        .delete(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });

    it("should fail when not admin", async () => {
      const res = await request(app)
        .delete(`/api/products/${testProduct.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

describe("Purchase Endpoints", () => {
  describe("POST /api/purchase", () => {
    it("should create a purchase when authenticated", async () => {
      const res = await request(app)
        .post("/api/purchase")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          productId: testProduct.id,
          quantity: 1,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("productId", testProduct.id);
    });

    it("should fail when not authenticated", async () => {
      const res = await request(app).post("/api/purchase").send({
        productId: testProduct.id,
        quantity: 1,
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/purchases", () => {
    it("should return all purchases when admin", async () => {
      const res = await request(app)
        .get("/api/purchases")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it("should fail when not admin", async () => {
      const res = await request(app)
        .get("/api/purchases")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/purchases/user", () => {
    it("should return user purchases when authenticated", async () => {
      const res = await request(app)
        .get("/api/purchases/user")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it("should fail when not authenticated", async () => {
      const res = await request(app).get("/api/purchases/user");

      expect(res.statusCode).toBe(401);
    });
  });
});
