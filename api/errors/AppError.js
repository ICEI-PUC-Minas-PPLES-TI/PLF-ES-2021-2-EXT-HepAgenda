module.exports = class AppError {
  // Erro que chegou
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
};
