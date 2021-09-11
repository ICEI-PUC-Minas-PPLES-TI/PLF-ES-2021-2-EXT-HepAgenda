module.exports = class AppError {
  // Erro que chegou
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};
