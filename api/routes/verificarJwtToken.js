const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");

verificarToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      autenticado: false,
      message: "Token de autenticação não fornecido."
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        autenticado: false,
        message: "Falha ao autenticar o token. Erro -> " + err
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  Usuario.findByPk(req.userId).then(usuario => {
    if (usuario.tipo === "A") {
      next();
      return;
    }

    res.status(403).send("Necessita de ser um usuário administrador!");
    return;
  });
};

const autenticacaoJwt = {};
autenticacaoJwt.verificarToken = verificarToken;
autenticacaoJwt.isAdmin = isAdmin;

module.exports = autenticacaoJwt;
