const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();

// Create express instance
const app = express();

// Require API routes
const routes = require("./routes");
const AppError = require("./errors/AppError");
const db = require("./database");

// Import API Routes
app.use(cors());
app.use(express.json());
app.use(routes);

db.connect();

app.use(function(erro, request, response, next) {
  if (erro instanceof AppError) {
    return response.status(erro.statusCode).json({
      message: erro.message
    });
  }

  // Caso seja outro erro
  if (process.env.APP_DEBUG) {
    return response.status(500).json({
      status: "Error",
      message: erro.message,
      stack: erro.stack
    });
  } else {
    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`
    });
  }
});

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
