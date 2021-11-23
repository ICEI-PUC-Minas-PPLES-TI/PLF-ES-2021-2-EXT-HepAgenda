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

  async signin(login, senha) {
    let usuario;
    usuario = await this.findByEmail(login, ["id", "nome", "tipo", "senha", "data_expira"]);
    if(!usuario)
      usuario = await this.findByLogin(login, ["id", "nome", "tipo", "senha", "data_expira"]);


    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de login ${login} não encontrado!`
      ]);

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      throw new AppError("Senha incorreta!", 401, [
        `'senha' incorreta para o usuário com 'email' ${login}!`
      ]);
    }

    if(usuario.dataValues.data_expira!=null) {
      const dataAtual = new Date(Date.now());
      const dataExpira = new Date(usuario.dataValues.data_expira);
      if(!(dataAtual.getTime()<dataExpira.getTime())) {
        throw new AppError("Usuário expirado!", 401, [
          "Usuário já expirado!"
        ]);
      }
    }

    // 1 dia em segundos: 86400
    const diasDuracao = 90;
    const duracaoSegundos = 86400 * diasDuracao;
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }, process.env.SECRET_KEY, {
      expiresIn: duracaoSegundos
    });

    return { token, diasDuracao };
  }

  async create(nome, email, telefone, login, senha, tipo, data_expira) {
    if (await this.findByEmail(email))
      throw new AppError("Email já utilizado!", 422, [
        `Usuário de 'email' ${email} já utilizado!`
      ]);

    if (login && (await this.findByLogin(login)))
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
      tipo,
      data_expira: data_expira ? data_expira : null,
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    if (!usuario)
      throw new AppError("Não foi possível criar o usuário!", 500, [
        `Erro interno, usuário de 'email' '${email}' não criado!`
      ]);

    return usuario;
  }

  async update(id, nome, telefone, senha, tipo, data_expira, data_excluido) {
    const usuario = await Usuario.findOne({
      where: {
        id: id
      },
      paranoid: false
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'id' ${id} não encontrado!`
      ]);

    let senhaTemp;
    if (senha) senhaTemp = bcrypt.hashSync(senha, 8);
    const senhaCriptografada = senhaTemp;

    if(data_excluido == false)
      data_excluido = null;

    if (data_excluido != null) {
      await this.deleteById(id);
    } else if (data_excluido == null) {
      usuario.setDataValue('data_excluido', null);
    }

    let dataExpira;
    if (data_expira && data_expira != null) {
      dataExpira = new Date(data_expira).toISOString();
    }

    await usuario
      .update({
        nome: nome,
        telefone: telefone,
        senha: senhaCriptografada,
        tipo: tipo,
        data_expira: dataExpira == null ? null : dataExpira,
        data_excluido: data_excluido
      }, { paranoid: false })
      .catch(error => {
        throw new AppError("Erro interno do servidor!", 500, error);
      });

    if (!usuario)
      throw new AppError("Não foi possível atualizar o usuário!", 500, [
        `Erro interno, usuário de 'email' '${usuario.email}' não atualizado!`
      ]);

    return usuario;
  }

  async forceDeleteById(id) {
    const usuario = await this.findById(id);

    if (!usuario)
      throw new AppError("Usuário não encontrado!", 404, [
        `Usuário de 'id' ${id} não encontrado!`
      ]);

    await Usuario.destroy({
      where: {
        id: id
      },
      force: true
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });
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

  async getAll(query, where) {
    const atributos = Object.keys(Usuario.rawAttributes);

    const qtdUsuarios = await Usuario.count();
    const { paginas, ...SortPaginateOptions } = SortPaginate(
      query,
      atributos,
      qtdUsuarios
    );

    const usuarios = await Usuario.findAndCountAll({
      ...SortPaginateOptions, where
    }).catch(function (error) {
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
