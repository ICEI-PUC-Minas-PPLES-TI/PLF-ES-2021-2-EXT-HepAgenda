const { Op } = require("sequelize");

const AppError = require("../errors/AppError");
const { SortPaginate } = require("../helpers/SortPaginate");

const Arquivo = require("../models/Arquivo");
const Consulta = require("../models/Consulta");
const LogConsulta = require("../models/LogConsulta");
const Paciente = require("../models/Paciente");
const Usuario = require("../models/Usuario");

const PacienteService = require("../services/PacienteService");
const UsuarioService = require("../services/UsuarioService");

const ArquivoService = require("./ArquivoService");
const BloqueioDataService = require("./BloqueioDataService");
const BloqueioDiaSemanaService = require("./BloqueioDiaSemanaService");
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

    // * Verificar se a dt_inicio é menor que a data atual
    let date = new Date(Date.now());
    let dataAtaul = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    if((new Date(dt_inicio)) < new Date(dataAtaul)) {
      throw new AppError("Data da consulta não pode ser anterior a data ataul!", 406, [
        `Data da consulta não pode ser anterior a data ataul!`
      ]);
    }
    // * ----------------> Fim: Verificar se a dt_inicio é menor que a data atual <----------------

    // * Verificar se a dt_inicio é uma data bloqueada
    let dataBloqueada;
    let bloqueioDataService = new BloqueioDataService();
    dataBloqueada = await bloqueioDataService.findByData(dt_inicio);
    if(dataBloqueada) {
      throw new AppError("Data selecionada para a consulta está bloqueada!", 406, [
        `Data selecionada para a consulta está bloqueada!`
      ]);
    }
    // * ----------------> Fim: Verificar se a dt_inicio é uma data bloqueada <----------------

    // * Verificar se a dt_inicio esta em um dia bloqueado
    let diaBloqueado;
    let bloqueioDiaSemanaService = new BloqueioDiaSemanaService();
    diaBloqueado = await bloqueioDiaSemanaService.findByDia(new Date(dt_inicio).getDay());
    if(diaBloqueado) {
      throw new AppError("Dia da semana desta data para a consulta está bloqueado!", 406, [
        `Dia da semana desta data para a consulta está bloqueado!`
      ]);
    }
    // * ----------------> Fim: Verificar se a dt_inicio esta em um dia bloqueado <----------------

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
    arquivos
  ) {
    const consulta = await this.findById(id);

    if (!consulta)
      throw new AppError("Consulta não encontrada!", 404, [
        `Consulta de 'id' ${id} não encontrada!`
      ]);

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

    // * ----------------> Início: Salvando log de atualização da consulta <----------------
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
    // * ----------------> Fim: Salvando log de atualização da consulta <----------------

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

  async getById(id) {
    const consulta = await Consulta.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Usuario,
          as: "usuario_criador"
        },
        {
          model: Usuario,
          as: "usuario_medico"
        },
        {
          model: Paciente,
          as: "paciente"
        },
        {
          model: Arquivo,
          as: "arquivos",
          attributes: ["id", "nome"]
        },
        {
          model: LogConsulta,
          as: "logs"
        }
      ]
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    if (!consulta)
      throw new AppError("Consulta não encontrada!", 404, [
        `Consulta de 'id' ${id} não encontrada!`
      ]);

    return consulta;
  }

  async getAll(query) {
    // * ----------------> Início: Capturando e tratando filtros/ordenadores da pesquisa <----------------
    /*
     * statusSolicitados = busca por status
     * dataInicio & dataFim = busca por dt_inicio da consulta em um período
     * atributosCriador = exibir apenas os atributos id ou email ou ambos do usuário criador da consulta
     * atributosMedico = exibir apenas os atributos id ou email ou ambos do usuário médico da consulta
     * atributosPaciente = exibir apenas os atributos id ou email ou ambos do paciente da consulta
     */
    const statusEnums = [
      "AGUARDANDOC",
      "AGUARDANDOA",
      "REALIZADO",
      "CANCELADO"
    ];
    let status = [];
    let statusTemp = statusEnums;
    if (query.status) {
      statusTemp = query.status.split(",");
      statusTemp.forEach(element => {
        if (element == "AC") status.push("AGUARDANDOC");
        else if (element == "AA") status.push("AGUARDANDOA");
        else if (element == "R") status.push("REALIZADO");
        else if (element == "C") status.push("CANCELADO");
        else
          throw new AppError(
            "Status não encontrado/inválido!",
            422,
            "'status' não encontrado"
          );
      });
    } else {
      status = statusEnums;
    }
    const statusSolicitados = status ? status : statusEnums;

    let dataInicioTemp, dataFimTemp;
    if (query.dataInicio && query.dataFim) {
      dataInicioTemp = new Date(
        query.dataInicio.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
      dataFimTemp = new Date(
        query.dataFim.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
    }
    const dataInicio = dataInicioTemp
      ? dataInicioTemp
      : new Date("1970-01-01".replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    const dataFim = dataFimTemp ? dataFimTemp : new Date(Date.now());

    const qtd = await Consulta.count();
    const { paginas, ...SortPaginateOptions } = SortPaginate(
      query,
      Object.keys(Consulta.rawAttributes) /* Todos os atributos de consulta */,
      qtd
    );
    let atributosCriadorTemp = ["id", "nome"];
    if (query.camposCriador)
      atributosCriadorTemp = query.camposCriador.split(",");
    const atributosCriador = atributosCriadorTemp;

    let atributosMedicoTemp = ["id", "nome"];
    if (query.camposMedico) atributosMedicoTemp = query.camposMedico.split(",");
    const atributosMedico = atributosMedicoTemp;

    let atributosPacienteTemp = ["id", "nome"];
    if (query.camposPaciente)
      atributosPacienteTemp = query.camposPaciente.split(",");
    const atributosPaciente = atributosPacienteTemp;
    // * ----------------> Fim: Capturando e tratando filtros/ordenadores da pesquisa <----------------

    const consultas = await Consulta.findAndCountAll({
      ...SortPaginateOptions,
      where: {
        dt_inicio: {
          [Op.between]: [dataInicio, dataFim]
        },
        status: statusSolicitados
      },
      include: [
        {
          model: Usuario,
          as: "usuario_criador",
          attributes: atributosCriador
        },
        {
          model: Usuario,
          as: "usuario_medico",
          attributes: atributosMedico
        },
        {
          model: Paciente,
          as: "paciente",
          attributes: atributosPaciente
        }
        // {
        //   model: Arquivo,
        //   as: "arquivos",
        //   attributes: ["id", "nome"]
        // },
        // {
        //   model: LogConsulta,
        //   as: "logs"
        // }
      ]
    }).catch(error => {
      throw new AppError("Erro interno do servidor!", 500, error);
    });

    return {
      dados: consultas.rows,
      quantidade: consultas.rows.length,
      total: qtd,
      paginas: paginas,
      offset: SortPaginateOptions.offset
    };
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
