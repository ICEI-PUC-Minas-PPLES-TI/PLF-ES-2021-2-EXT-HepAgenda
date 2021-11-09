const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const { SortPaginate } = require("../helpers/SortPaginate");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UsuarioService {
  async findById(id, atributos) {
    const usuario = await Usuario.findOne({
      where: {
        id: id
      },
      attributes: atributos
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    return usuario;
  }

  async findByEmail(email, atributos) {
    const usuario = await Usuario.findOne({
      where: {
        email: email
      },
      attributes: atributos
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    return usuario;
  }

  async findByLogin(login, atributos) {
    const usuario = await Usuario.findOne({
      where: {
        login: login
      },
      attributes: atributos
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    return usuario;
  }

  async signin(email, senha) {
    const usuario = await this.findByEmail(email, ["id", "senha"]);

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'email' ${email} não encontrado!`
      ]);

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      throw new AppError("Senha incorreta!", 403, [
        `'senha' incorreta para o usuário com 'email' ${email}!`
      ]);
    }

    // 1 dia em segundos: 86400
    const diasDuracao = 90;
    const duracaoSegundos = 86400 * diasDuracao;
    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, {
      expiresIn: duracaoSegundos
    });

    return { token, diasDuracao };
  }

  async create(nome, email, telefone, login, senha, tipo) {
    if (await this.findByEmail(email))
      throw new AppError("Email já utilizado!", 422, [
        `Usuário de 'email' ${email} já utilizado!`
      ]);

    if (await this.findByLogin(login))
      throw new AppError("Login já utilizado!", 422, [
        `Usuário de 'login' ${login} já utilizado!`
      ]);

    const senhaCriptografada = bcrypt.hashSync(senha, 8);
    const usuario = await Usuario.create({
      nome,
      email,
      telefone,
      login: login ? login : email,
      senha: senhaCriptografada,
      tipo
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    if (!usuario)
      throw new AppError("Não foi possível criar o usuário!", 500, [
        `Erro interno, usuário de 'email' '${email}' não criado!`
      ]);

    return usuario;
  }

  async update(id, nome, telefone, senha, tipo) {
    const usuario = await this.findById(id);

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'id' ${id} não encontrado!`
      ]);

    let senhaTemp;
    if (senha) senhaTemp = bcrypt.hashSync(senha, 8);
    const senhaCriptografada = senhaTemp;

    await usuario
      .update({
        nome: nome,
        telefone: telefone,
        senha: senhaCriptografada,
        tipo: tipo
      })
      .catch(error => {
        throw new AppError("Erro interno do servidor!", 500, error);
      });

    if (!usuario)
      throw new AppError("Não foi possível atualizar o usuário!", 500, [
        `Erro interno, usuário de 'email' '${usuario.email}' não atualizado!`
      ]);

    return usuario;
  }

  async deleteById(id) {
    const usuario = await this.findById(id);

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'id' ${id} não encontrado!`
      ]);

    await Usuario.destroy({
      where: {
        id: id
      }
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });
  }

  async getAll(query) {
    const atributos = Object.keys(Usuario.rawAttributes);

    const qtdUsuarios = await Usuario.count();
    const { paginas, ...SortPaginateOptions } = SortPaginate(
      query,
      atributos,
      qtdUsuarios
    );

    const usuarios = await Usuario.findAndCountAll({
      ...SortPaginateOptions
    }).catch(function(error) {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    return {
      dados: usuarios.rows,
      quantidade: usuarios.rows.length,
      total: usuarios.count,
      paginas: paginas,
      offset: SortPaginateOptions.offset
    };
  }
}

module.exports = UsuarioService;
