const AppError = require("../errors/AppError");
const LogConsulta = require("../models/LogConsulta");
const {
  createLogConsultaValidation
} = require("../validation/LogConsultaValidation");
const UsuarioService = require("./UsuarioService");

class LogConsultaService {
  async create(descricao, usuario_id, consulta_id) {
    const tempoAgora = Date.now();
    const hoje = new Date(tempoAgora);
    const log = {};

    log.data = hoje.toUTCString();
    log.descricao = descricao;

    const usuarioService = new UsuarioService();
    if (usuario_id) {
      let usuario_temp = await usuarioService.findById(usuario_id);
      if (!usuario_temp)
        throw new AppError("Usuário não encontrado!", 404, [
          `Usuário de 'usuario_id' ${usuario_id} não encontrado, não foi possível criar log para a consulta!`
        ]);
    }
    log.usuario_id = usuario_id;
    log.consulta_id = consulta_id;

    const scheme = createLogConsultaValidation;

    try {
      await scheme.validate(log, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    await LogConsulta.create({
      data: log.data,
      descricao: log.descricao,
      usuario_id: log.usuario_id,
      consulta_id: log.consulta_id
    }).catch(erro => {
      throw new AppError("Erro interno do servidor!", 500, erro);
    });

    return log;
  }

  async gerarLogString(
    consultaData,
    usuario_id_medico,
    usuario_medico,
    status,
    descricao,
    usuario_criador
  ) {
    const usuarioService = new UsuarioService();

    // Editar nome do médico
    let nomeMedicoAtualTemp;
    if (consultaData.usuario_id_medico) {
      let usuario_medico_atual = await usuarioService.findById(
        consultaData.usuario_id_medico
      );
      let nomes = usuario_medico_atual.dataValues.nome.split(" ");
      nomeMedicoAtualTemp =
        nomes[0] + `${nomes[1] ? " " + nomes[1].substr(0, 1) : ""}`;
    }
    const medicoAtual = nomeMedicoAtualTemp;

    let nomeMedicoNovoTemp;
    if (usuario_medico) {
      let nomes = usuario_medico.dataValues.nome.split(" ");
      nomeMedicoNovoTemp =
        nomes[0] + `${nomes[1] ? " " + nomes[1].substr(0, 1) : ""}`;
    }
    const medicoNovo = nomeMedicoNovoTemp;

    const userId = usuario_criador.dataValues.id;
    const consulta_id = consultaData.id;

    // Capturando usuário que modificou descrição
    const log_descricao = `${
      descricao
        ? "Usuário " + usuario_criador.login + " alterou a descrição."
        : ""
    }`;

    // Capturando usuário que modificou status
    const log_status = `${
      status && status != consultaData.status
        ? "Usuário " +
          usuario_criador.login +
          " alterou o status de " +
          consultaData.status +
          " para " +
          status +
          "."
        : ""
    }`;

    // Capturando usuário que modificou médico
    const log_medico = `${
      usuario_id_medico && usuario_id_medico != consultaData.usuario_id_medico
        ? "Usuário " +
          usuario_criador.login +
          " alterou o médico de " +
          medicoAtual +
          " para " +
          medicoNovo +
          "."
        : ""
    }`;

    // Salvando logs caso existir as modificações
    if (log_descricao) await this.create(log_descricao, userId, consulta_id);
    if (log_status) await this.create(log_status, userId, consulta_id);
    if (log_medico) await this.create(log_medico, userId, consulta_id);
  }

  async getAll(id_consulta) {
    const logs = await LogConsulta.findAll({
      where: {
        consulta_id: id_consulta
      }
    });
    return logs;
  }
}

module.exports = LogConsultaService;
