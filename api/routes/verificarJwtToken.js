const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");

const verificarToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      autenticado: false,
      message: "Token de autenticação não fornecido."
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        autenticado: false,
        message: "Falha ao autenticar o token. Erro -> " + err
      });
    }
    req.user = decoded;
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

    res.status(403).send("Necessita de ser um usuário administrador!");
    return;
  });
};

const isAdminOrMedic = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A" || usuario.tipo === "M") {
      next();
      return;
    }

    res.status(403).send("Necessita de ser um usuário administrador ou médico!");
    return;
  });
};

const isAdminOrMedicOrViewer = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A" || usuario.tipo === "M" || usuario.tipo === "V") {
      next();
      return;
    }

    res.status(403).send("Necessita de ser um usuário administrador ou médico ou visualizador!");
    return;
  });
};

const autenticacaoJwt = {
  verificarToken,
  isAdmin,
  isAdminOrMedic,
  isAdminOrMedicOrViewer
};

module.exports = autenticacaoJwt;
