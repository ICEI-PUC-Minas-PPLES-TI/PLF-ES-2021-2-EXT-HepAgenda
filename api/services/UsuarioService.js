const Usuario = require('../models/Usuario');

class UsuarioService{
  async getById(id, atributos) {
  const usuario = await Usuario.findOne({
    where: {
      id: id
    },
    attributes: atributos,
  });
  return usuario;
}}

module.exports = UsuarioService;
