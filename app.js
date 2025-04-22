require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3001;

// ini ditaro diawal supaya ketika di use juga dapet fitur itu
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan("dev"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api", routes);

app.use(errorHandler);

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(
      `API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}

module.exports = app;
