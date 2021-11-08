const AppError = require("../errors/AppError");
const Consulta = require("../models/Consulta");

const PacienteService = require("../services/PacienteService");
const UsuarioService = require("../services/UsuarioService");
const ArquivoService = require("./ArquivoService");
const LogConsultaService = require("./LogConsultaService");

class ConsultaService {
  async findById(id, atributos) {
    const consulta = await Consulta.findOne({
      where: {
        id: id
      },
      attributes: atributos
    });
    return consulta;
  }

  async create(
    paciente_id,
    descricao,
    status,
    detalhes,
    dt_inicio,
    usuario_id_medico,
    user_id
  ) {
    // * ----------------> Início: Validando dados da consulta <----------------
    // * Verificando se paciente com id X existe
    const pacienteService = new PacienteService();
    const paciente = await pacienteService.findById(paciente_id);
    if (!paciente)
      throw new AppError("Paciente não encontrado!", 404, [
        `Paciente de 'paciente_id' ${paciente_id} não encontrado!`
      ]);

    const usuarioService = new UsuarioService();
    const usuario_criador = await usuarioService.findById(user_id);

    // * Verificando caso: se enviar o id do médico da consulta, verificar se existe médico com esse id
    let usuario_medico_temp;
    if (usuario_id_medico) {
      usuario_medico_temp = await usuarioService.findById(usuario_id_medico);
      if (!usuario_medico_temp)
        throw new AppError("Médico não encontrado!", 404, [
          `Médico de 'usuario_id_medico' ${usuario_id_medico} não encontrado!`
        ]);
    }
    // * ----------------> Fim: Validando dados da consulta <----------------

    const consulta = await Consulta.create({
      paciente_id: paciente_id,
      descricao: descricao ? descricao : null,
      status: status,
      detalhes: detalhes ? detalhes : null,
      dt_inicio: dt_inicio,
      dt_desmarcada: null,
      usuario_id_criador: user_id,
      usuario_id_medico: usuario_id_medico ? usuario_id_medico : null
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    if (!consulta)
      throw new AppError("Não foi possível criar a consulta!", 500, [
        `Erro interno, consulta não criada!`
      ]);

    // * ----------------> Início: Criando o log da consulta <----------------
    const logConsultaService = new LogConsultaService();
    const log_descricao = `Consulta criada pelo usuário ${usuario_criador.dataValues.login}.`;
    const userId = user_id;
    const consulta_id = consulta.id;
    await logConsultaService.create(log_descricao, userId, consulta_id);
    // * ----------------> Fim: Criando o log da consulta <----------------

    return consulta;
  }

  async update(
    id,
    paciente_id,
    descricao,
    status,
    detalhes,
    dt_inicio,
    usuario_id_medico,
    arquivos,
  ) {
    const consulta = await this.findById(id);

    if (!consulta) {
      throw new AppError("Consulta não encontrada!", 404, [
        `Consulta de 'id' ${id} não encontrada!`
      ]);
    }
    const consultaData = consulta.dataValues;

    // * ----------------> Início: Validando/Capturando dados da consulta <----------------
    // * Verificando se esta desmarcando a consulta/status cancelado
    let dt_desmarcadaTemp = null;
    const tempoAgora = Date.now();
    if (status && status == "CANCELADO") {
      dt_desmarcadaTemp = new Date(tempoAgora);
    } else {
      dt_desmarcadaTemp = null;
    }
    const dt_desmarcada = dt_desmarcadaTemp;

    // * Verificar se o paciente de id X existe
    let pacienteTemp = null;
    if (paciente_id) {
      const pacienteService = new PacienteService();
      pacienteTemp = await pacienteService.findById(paciente_id);
      if (!pacienteTemp)
        throw new AppError("Paciente não encontrado!", 404, [
          `Paciente de 'paciente_id' ${paciente_id} não encontrado!`
        ]);
    }

    // * Verificando caso: se enviar o id do médico da consulta, verificar se existe médico com esse id (ou administrador)
    let usuarioMedicoTemp = null;
    if (usuario_id_medico) {
      const usuarioService = new UsuarioService();
      const usuario_medico = await usuarioService.findById(usuario_id_medico);
      // Se enviar o id do médico, verificar se existe
      if (usuario_id_medico && !usuario_medico)
        throw new AppError("Médico não encontrado!", 404, [
          `Médico de 'usuario_id_medico' ${usuario_id_medico} não encontrado!`
        ]);
      usuarioMedicoTemp = usuario_medico;

      /*
        * Se enviar o id do médico, verificar se é médico
        ! O médico da consulta pode ser um usuário administrador com essa regra
        if (usuario_medico.dataValues.tipo != "M") Para delimitar apenas médico
      */
      if (
        usuario_medico.dataValues.tipo != "M" &&
        usuario_medico.dataValues.tipo != "A"
      )
        throw new AppError(
          "'usuario_id_medico' não é médico nem administrador!",
          422,
          [
            `Usuário de 'usuario_id_medico' ${usuario_id_medico} para ser médico da consulta não é médico e não é administrador!`
          ]
        );
    }
    const usuario_medico = usuarioMedicoTemp;
    // * ----------------> Fim: Validando/Capturando dados da consulta <----------------

    // * ----------------> Início: Salvando arquivos da consulta <----------------
    if (Array.isArray(arquivos) && arquivos.length) {
      const arquivoService = new ArquivoService();
      await arquivoService.create(consultaData.id, arquivos);
    }
    // * ----------------> Fim: Salvando arquivos da consulta <----------------

    // * ----------------> Início: Capturando quem é o criador da consulta <----------------
    const usuarioService = new UsuarioService();
    const usuario_criador = await usuarioService.findById(
      consultaData.usuario_id_criador
    );
    // * ----------------> Fim: Início capturando quem é o criador da consulta <----------------

    // * ----------------: Início: Salvando log de atualização da consulta <----------------
    // Se houver modificação no status ou médico ou descrição, atualiza o log
    if (
      (status && status != consultaData.status) ||
      (usuario_id_medico &&
        usuario_id_medico != consultaData.usuario_id_medico) ||
      (descricao && descricao != consultaData.descricao)
    ) {
      const logConsultaService = new LogConsultaService();
      await logConsultaService.gerarLogString(
        consultaData,
        usuario_id_medico,
        usuario_medico,
        status,
        descricao,
        usuario_criador
      );
    }
    // * ----------------: Fim: Salvando log de atualização da consulta <----------------

    await consulta
      .update({
        paciente_id: paciente_id ? paciente_id : consultaData.paciente_id,
        descricao: descricao ? descricao : consultaData.descricao,
        status: status ? status : consultaData.status,
        detalhes: detalhes ? detalhes : consultaData.detalhes,
        dt_inicio: dt_inicio ? dt_inicio : consultaData.dt_inicio,
        dt_desmarcada: dt_desmarcada,
        usuario_id_medico: usuario_id_medico
          ? usuario_id_medico
          : consultaData.usuario_id_medico
      })
      .catch(error => {
        throw new AppError("Erro interno do servidor!", 500, error);
      });

    return consulta;
  }

  async getByPacienteId(idPaciente) {
    const consulta = await Consulta.findOne({
      where: {
        paciente_id: idPaciente
      }
    });
    return consulta;
  }
}

module.exports = ConsultaService;
