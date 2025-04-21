// Load test environment variables
process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

const { sequelize } = require("../models");

// Increase test timeout
jest.setTimeout(30000);

// Setup database before all tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    // Sync database - this will create tables
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Test database setup failed:", error);
    process.exit(1);
  }
});

// Clean up database after all tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error("Error closing test database:", error);
  }
});
