const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");

const verificarToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    throw new AppError(
      "Falha ao autenticar no sistema, autenticação não fornecida.!!",
      403,
      ["Token de autenticação não fornecido.!!"]
    );
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      throw new AppError("Falha ao autenticar no sistema!!", 403, [
        "Falha ao autenticar o token!!",
        err
      ]);
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A") {
      next();
      return;
    }

    throw new AppError("Necessita de ser um usuário administrador!", 403, [
      "Token fornecido não é de um usuário administrador!"
    ]);
  });
};

const isAdminOrMedic = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A" || usuario.tipo === "M") {
      next();
      return;
    }

    throw new AppError(
      "Necessita de ser um usuário administrador ou médico!",
      403,
      ["Token fornecido não é de um usuário administrador ou médico!"]
    );
  });
};

const isAdminOrMedicOrViewer = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A" || usuario.tipo === "M" || usuario.tipo === "V") {
      next();
      return;
    }

    throw new AppError(
      "Necessita de ser um usuário administrador ou médico ou visualizador!",
      403,
      [
        "Token fornecido não é de um usuário administrador ou médico ou visualizador!"
      ]
    );
  });
};

const autenticacaoJwt = {
  verificarToken,
  isAdmin,
  isAdminOrMedic,
  isAdminOrMedicOrViewer
};

module.exports = autenticacaoJwt;
