const AppError = require("../errors/AppError");
const UsuarioService = require("../services/UsuarioService");
const {
  createUsuarioValidation,
  signinUsuarioValidation,
  updateUsuarioValidation
} = require("../validation/UsuarioValidation");

class UsuarioController {
  // URI exemplo: POST http://localhost:3000/api/signin
  async signin(request, response) {
    const scheme = signinUsuarioValidation;

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const { login, senha } = request.body;

    const usuarioService = new UsuarioService();
    const { token, diasDuracao } = await usuarioService.signin(login, senha);

    return response.status(200).send({
      acessoToken: token,
      diasDuracao: diasDuracao
    });
  }

  async me(req, res) {
    return res.status(200).send({
      nome: req.user.nome,
      tipo: req.user.tipo,
    })
  }

  async create(request, response) {
    const scheme = createUsuarioValidation;

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const { nome, email, telefone, login, senha, tipo } = request.body;

    const usuarioService = new UsuarioService();
    const usuario = await usuarioService.create(
      nome,
      email,
      telefone,
      login,
      senha,
      tipo
    );

    return response.status(201).json({
      usuarioID: usuario.id
    });
  }

  // URI exemplo: DELETE http://localhost:3000/api/usuario/1
  async delete(request, response) {
    const id = request.params.id;

    const usuarioService = new UsuarioService();
    await usuarioService.deleteById(id);

    return response.status(204).json({});
  }

  // URI de exemplo: UPDATE http://localhost:3000/api/usuario/1
  async update(request, response) {
    const scheme = updateUsuarioValidation;

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const { nome, telefone, senha, tipo } = request.body;
    const id = request.params.id;

    const usuarioService = new UsuarioService();
    await usuarioService.update(id, nome, telefone, senha, tipo);

    return response.status(200).json({});
  }

  // URI de exemplo: GET http://localhost:3000/api/usuario/1
  async get(request, response) {
    const id = request.params.id;

    const usuarioService = new UsuarioService();
    const usuario = await usuarioService.findById(id);

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'id' ${id} não encontrado!`
      ]);

    return response.status(200).json(usuario);
  }

  // URI de exemplo: GET http://localhost:3000/api/usuario?pagina=1&limite=5&atributo=nome&ordem=DESC
  // Todas as querys são opicionais
  async getAll(request, response) {
    const usuarioService = new UsuarioService();
    const {
      dados,
      quantidade,
      total,
      paginas,
      offset
    } = await usuarioService.getAll(request.query, request.query.medico ? { tipo: 'M' } : undefined);

    return response.status(200).json({
      dados,
      quantidade,
      total,
      paginas,
      offset
    });
  }
}

module.exports = UsuarioController;
