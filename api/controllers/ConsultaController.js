const Consulta = require("../models/Consulta");
const Arquivo = require("../models/Arquivo");

const PacienteService = require("../services/PacienteService");
const UsuarioService = require("../services/UsuarioService");

const { SortPaginate } = require("../helpers/SortPaginate");
const AppError = require("../errors/AppError");

const { Op } = require("sequelize");
const yup = require("yup");
const LogConsultaController = require("./LogConsultaController");
const ConsultaService = require("../services/ConsultaService");
const ArquivoService = require("../services/ArquivoService");

class ConsultaController {
  async create(request, response) {
    const statusEnums = ["AGUARDANDOC", "AGUARDANDOA", "REALIZADO"];

    const scheme = yup.object().shape({
      paciente_id: yup
        .number("'paciente_id' deve ser numérico!")
        .required("'paciente_id' obrigatório!"),
      descricao: yup
        .string("'descricao' deve ser string!")
        .max(60, "'descricao' deve ter no máximo 60 caracteres!"),
      status: yup
        .mixed()
        .oneOf(statusEnums, `'status' deve ser algum destes: ${statusEnums}.`)
        .required("'status' obrigatório!"),
      detalhes: yup
        .string("'detalhes' deve ser string!")
        .max(65000, "'detalhes' deve ter no máximo 65000 caracteres!"),
      dt_inicio: yup
        .date("'dt_inicio' deve ser data!")
        .required("'dt_inicio' obrigatório!"),
      usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const {
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      usuario_id_medico
    } = request.body;

    const pacienteService = new PacienteService();
    const paciente = await pacienteService.getById(paciente_id);
    if (!paciente) throw new AppError("Paciente não encontrado!", 404, ["'paciente_id' não encontrado!"]);

    const usuarioService = new UsuarioService();
    const usuario_criador = await usuarioService.getById(request.userId);

    // Se enviar o id do médico, verificar se existe
    let usuario_medico_temp;
    if (usuario_id_medico) {
      usuario_medico_temp = await usuarioService.getById(usuario_id_medico);
      if (!usuario_medico_temp)
        throw new AppError("Médico não encontrado!", 404, ["'usuario_id_medico' não encontrado!"]);
    }
    const usuario_medico = usuario_medico_temp;
    /*
      * Se enviar o id do médico, verificar se é médico
      ! O médico da consulta pode ser um usuário administrador com essa regra
      if (usuario_medico && usuario_medico.dataValues.tipo != "M") Para delimitar apenas médico
    */
    if (
      usuario_medico &&
      usuario_medico.dataValues.tipo != "M" &&
      usuario_medico.dataValues.tipo != "A"
    )
      throw new AppError(
        "Usuário não é médico nem administrador!",
        403,
        ["'usuario_id_medico' não é médico nem administrador!"]
      );

    const consulta = Consulta.build({
      paciente_id: paciente_id,
      descricao: descricao ? descricao : null,
      status: status,
      detalhes: detalhes ? detalhes : null,
      dt_inicio: dt_inicio,
      dt_desmarcada: null,
      usuario_id_criador: request.userId,
      usuario_id_medico: usuario_id_medico ? usuario_id_medico : null
    });

    consulta
      .save()
      .then(function(consultaObj) {
        // Salvando log de criação
        const logConsultaController = new LogConsultaController();
        const log_descricao = `Consulta criada pelo usuário ${usuario_criador.dataValues.login}.`;
        const userId = request.userId;
        const consulta_id = consultaObj.dataValues.id;
        logConsultaController.create(log_descricao, userId, consulta_id);

        return response.status(201).json({
          id: consulta.id
        });
      })
      .catch(function(erro) {
        throw new AppError(erro.message, 500);
      });
  }

  async update(request, response) {
    const statusEnums = [
      "AGUARDANDOC",
      "AGUARDANDOA",
      "REALIZADO",
      "CANCELADO"
    ];

    const scheme = yup.object().shape({
      paciente_id: yup.number("'paciente_id' deve ser numérico!"),
      descricao: yup
        .string("'descricao' deve ser string!")
        .max(60, "'descricao' deve ter no máximo 60 caracteres!"),
      status: yup
        .mixed()
        .oneOf(statusEnums, `'status' deve ser algum destes: ${statusEnums}.`),
      detalhes: yup
        .string("'detalhes' deve ser string!")
        .max(65000, "'detalhes' deve ter no máximo 65000 caracteres!"),
      dt_inicio: yup.date("'dt_inicio' deve ser data!"),
      usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const id = request.params.id;
    const {
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      usuario_id_medico
    } = request.body;

    let dt_desmarcadaTemp = null;
    const tempoAgora = Date.now();
    if (status && status == "CANCELADO") {
      dt_desmarcadaTemp = new Date(tempoAgora);
    } else {
      dt_desmarcadaTemp = null;
    }
    const dt_desmarcada = dt_desmarcadaTemp;

    let usuarioPacienteTemp = null;
    if (paciente_id) {
      const pacienteService = new PacienteService();
      usuarioPacienteTemp = await pacienteService.getById(paciente_id);
      if (!usuarioPacienteTemp)
        throw new AppError("'paciente_id' não encontrado!", 404);
    }

    let usuarioMedicoTemp = null;
    if (usuario_id_medico) {
      const usuarioService = new UsuarioService();
      const usuario_medico = await usuarioService.getById(usuario_id_medico);
      usuarioMedicoTemp = usuario_medico;
      // Se enviar o id do médico, verificar se existe
      if (usuario_id_medico && !usuario_medico)
        throw new AppError("'usuario_id_medico' não encontrado!", 404);

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
          422
        );
    }
    const usuario_medico = usuarioMedicoTemp;

    const consulta = await Consulta.findOne({
      where: {
        id: id
      }
    });
    if (consulta == null) {
      throw new AppError("Consulta não encontrada!", 404);
    }

    const consultaData = consulta.dataValues;

    if (Array.isArray(request.files) && request.files.length) {
      const arquivoService = new ArquivoService();
      await arquivoService.create(consultaData.id, request.files);
    }

    const usuarioService = new UsuarioService();
    const usuario_criador = (
      await usuarioService.getById(consultaData.usuario_id_criador)
    ).dataValues;

    // Salvando log de criação
    if (
      (status && status != consultaData.status) ||
      (usuario_id_medico &&
        usuario_id_medico != consultaData.usuario_id_medico) ||
      (descricao && descricao != consultaData.descricao)
    ) {
      let nomeMedicoAtualTemp;
      if (consultaData.usuario_id_medico) {
        let usuario_medico_atual = await usuarioService.getById(
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

      const userId = request.userId;
      const consulta_id = consultaData.id;

      const log_descricao = `${
        descricao
          ? "Usuário " + usuario_criador.login + " alterou a descrição."
          : ""
      }`;
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

      const logConsultaController = new LogConsultaController();
      if (log_descricao)
        logConsultaController.create(log_descricao, userId, consulta_id);
      if (log_status)
        logConsultaController.create(log_status, userId, consulta_id);
      if (log_medico)
        logConsultaController.create(log_medico, userId, consulta_id);
    }

    consulta.update({
      paciente_id: paciente_id ? paciente_id : consultaData.paciente_id,
      descricao: descricao ? descricao : consultaData.descricao,
      status: status ? status : consultaData.status,
      detalhes: detalhes ? detalhes : consultaData.detalhes,
      dt_inicio: dt_inicio ? dt_inicio : consultaData.dt_inicio,
      dt_desmarcada: dt_desmarcada,
      usuario_id_medico: usuario_id_medico
        ? usuario_id_medico
        : consultaData.usuario_id_medico
    });
    response.status(200).json(consulta);
  }

  async get(request, response) {
    const consulta = await Consulta.findOne({
      where: {
        id: request.params.id
      },
      include: [
        {
          model: Arquivo,
          as: "arquivos",
          attributes: ["id", "nome"]
        }
      ]
    });
    if (consulta == null) {
      throw new AppError("Consulta não encontrada!", 404);
    }
    // Adicionando usuários e paciente no retorno
    const usuarioService = new UsuarioService();
    const pacienteService = new PacienteService();
    consulta.dataValues.paciente = await pacienteService.getById(
      consulta.dataValues.paciente_id
    );
    consulta.dataValues.usuario_criador = await usuarioService.getById(
      consulta.dataValues.usuario_id_criador
    );
    consulta.dataValues.usuario_medico = await usuarioService.getById(
      consulta.dataValues.usuario_id_medico
    );

    // Adicionando logs
    const logConsultaController = new LogConsultaController();
    consulta.dataValues.logs = await logConsultaController.getAll(
      consulta.dataValues.id
    );

    response.status(200).json(consulta);
  }

  // Rota exemplo:
  // /api/consulta?pagina=1&limite=4&atributo=id&ordem=ASC&camposPaciente=id,nome&camposMedico=id,nome&dataInicio=2021-09-18&dataFim=2021-09-20&status=AC,AA,R,C
  async getAll(request, response) {
    const statusEnums = [
      "AGUARDANDOC",
      "AGUARDANDOA",
      "REALIZADO",
      "CANCELADO"
    ];
    let status = [];
    let statusTemp = statusEnums;
    if (request.query.status) {
      statusTemp = request.query.status.split(",");
      statusTemp.forEach(element => {
        if (element == "AC") status.push("AGUARDANDOC");
        else if (element == "AA") status.push("AGUARDANDOA");
        else if (element == "R") status.push("REALIZADO");
        else if (element == "C") status.push("CANCELADO");
        else
          return response.status(404).json({ erro: "'status' não encontrado" });
      });
    } else {
      status = statusEnums;
    }
    const statusSolicitados = status ? status : statusEnums;

    let dataInicioTemp, dataFimTemp;
    if (request.query.dataInicio && request.query.dataFim) {
      dataInicioTemp = new Date(
        request.query.dataInicio.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
      dataFimTemp = new Date(
        request.query.dataFim.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      );
    }
    const dataInicio = dataInicioTemp
      ? dataInicioTemp
      : new Date("1970-01-01".replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    const dataFim = dataFimTemp ? dataFimTemp : new Date(Date.now());

    Consulta.findAndCountAll({
      where: {
        dt_inicio: {
          [Op.between]: [dataInicio, dataFim]
        },
        status: statusSolicitados
      }
    })
      .then(dados => {
        const { paginas, ...SortPaginateOptions } = SortPaginate(
          request.query,
          Object.keys(
            Consulta.rawAttributes
          ) /* Todos os atributos de consulta */,
          dados.count
        );
        Consulta.findAll({
          ...SortPaginateOptions,
          where: {
            dt_inicio: {
              [Op.between]: [dataInicio, dataFim]
            },
            status: statusSolicitados
          }
        })
          .then(async consultas => {
            // Adicionando usuários e paciente no retorno
            await Promise.all(
              consultas.map(async consulta => {
                let atributosPacienteTemp = ["id", "nome"];
                let atributosMedicoTemp = ["id", "nome"];
                if (request.query.camposPaciente)
                  atributosPacienteTemp = request.query.camposMedico.split(",");
                if (request.query.camposMedico)
                  atributosMedicoTemp = request.query.camposMedico.split(",");
                const atributosPaciente = atributosPacienteTemp;
                const atributosMedico = atributosMedicoTemp;
                const usuarioService = new UsuarioService();
                const pacienteService = new PacienteService();
                // Adicionando dados do paciente
                consulta.dataValues.paciente = await pacienteService.getById(
                  consulta.dataValues.paciente_id,
                  atributosPaciente
                );
                // Adicionando dados do médico associado a consulta
                consulta.dataValues.usuario_medico = await usuarioService.getById(
                  consulta.dataValues.usuario_id_medico,
                  atributosMedico
                );
                // * Desativado: Adicionando dados do criador da consulta
                // consulta.dataValues.usuario_criador = await usuarioService.getById(
                //   consulta.dataValues.usuario_id_criador
                // );
                // * Desativado: Adicionando todos os logs da consulta
                // const logConsultaController = new LogConsultaController();
                // consulta.dataValues.logs = await logConsultaController.getAll(
                //   consulta.dataValues.id
                // );
              })
            );

            response.status(200).json({
              dados: consultas,
              quantidade: consultas.length,
              total: dados.count,
              paginas: paginas,
              offset: SortPaginateOptions.offset
            });
          })
          .catch(erro => {
            throw new AppError(erro.message, 500);
          });
      })
      .catch(function(erro) {
        throw new AppError(erro.message, 500);
      });
  }

  async checkPrimeiraConsulta(request, response) {
    const scheme = yup.object().shape({
      paciente_id: yup
        .number("'paciente_id' deve ser numérico!")
        .required("'paciente_id' obrigatório!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const { paciente_id } = request.body;

    const pacienteService = new PacienteService();
    const paciente = await pacienteService.getById(paciente_id);
    if (!paciente) throw new AppError("'paciente_id' não encontrado!", 404);

    const consultaService = new ConsultaService();
    const primeiraConsulta = (await consultaService.getByPacienteId(
      paciente_id
    ))
      ? false
      : true;

    return response.status(201).json({
      primeiraConsulta: primeiraConsulta
    });
  }
}

module.exports = ConsultaController;
