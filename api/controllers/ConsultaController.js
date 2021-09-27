const Consulta = require("../models/Consulta");

const UsuarioController = require("./UsuarioController");
const PacienteController = require("./PacienteController");

const { SortPaginate } = require("../helpers/SortPaginate");
const AppError = require("../errors/AppError");

const yup = require("yup");
const LogConsultaController = require("./LogConsultaController");

class ConsultaController {
  async create(request, response) {
    const statusEnums = [
      "AGUARDANDOC",
      "AGUARDANDOA",
      "REALIZADO",
      "CANCELADO"
    ];

    const scheme = yup.object().shape({
      paciente_id: yup
        .number("'paciente_id' deve ser numérico!")
        .required("'paciente_id' obrigatório!"),
      descricao: yup
        .string("'descricao' deve ser string!")
        .required("'descricao' obrigatório!")
        .max(60, "'descricao' deve ter no máximo 60 caracteres!"),
      status: yup
        .mixed()
        .oneOf(statusEnums, `'status' deve ser algum destes: ${statusEnums}.`)
        .required("'status' obrigatório!"),
      detalhes: yup
        .string("'detalhes' deve ser string!")
        .required("'detalhes' obrigatório!")
        .max(65000, "'detalhes' deve ter no máximo 65000 caracteres!"),
      dt_inicio: yup
        .date("'dt_inicio' deve ser data!")
        .required("'dt_inicio' obrigatório!"),
      dt_desmarcada: yup.date("'dt_desmarcada' deve ser data!"),
      usuario_id_criador: yup
        .number("'usuario_id_criador' deve ser numérico!")
        .required("'usuario_id_criador' obrigatório!"),
      usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const {
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      dt_desmarcada,
      usuario_id_criador,
      usuario_id_medico
    } = request.body;

    const pacienteController = new PacienteController();
    const paciente = await pacienteController.getByID(paciente_id);
    if (!paciente) throw new AppError("'paciente_id' não encontrado!", 404);

    const usuarioController = new UsuarioController();
    const usuario_criador = await usuarioController.getByID(usuario_id_criador);
    const usuario_medico = await usuarioController.getByID(usuario_id_medico);
    if (!usuario_criador)
      throw new AppError("'usuario_id_criador' não encontrado!", 404);
    // Se enviar o id do médico, verificar se existe
    if (usuario_id_medico && !usuario_medico)
      throw new AppError("'usuario_id_medico' não encontrado!", 404);
    // Se enviar o id do médico, verificar se é médico
    if (usuario_id_medico && usuario_medico.dataValues.tipo != "M")
      throw new AppError("'usuario_id_medico' não é médico!", 422);

    const consulta = Consulta.build({
      paciente_id: paciente_id,
      descricao: descricao,
      status: status,
      detalhes: detalhes,
      dt_inicio: dt_inicio,
      dt_desmarcada: dt_desmarcada ? dt_desmarcada : null,
      usuario_id_criador: usuario_id_criador,
      usuario_id_medico: usuario_id_medico ? usuario_id_medico : null
    });

    consulta
      .save()
      .then(function(consultaObj) {
        // TODO: fazer o arquivo

        // Salvando log de criação
        const logConsultaController = new LogConsultaController();
        const log_descricao = `Consulta criada.`;
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
      id: yup.number("'id' deve ser numérico!").required("'id' é obrigatório!"),
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
      dt_desmarcada: yup.date("'dt_desmarcada' deve ser data!"),
      usuario_id_medico: yup.number("'usuario_id_medico' deve ser numérico!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const {
      id,
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      dt_desmarcada,
      usuario_id_medico
    } = request.body;

    const pacienteController = new PacienteController();
    const paciente = await pacienteController.getByID(paciente_id);
    if (!paciente) throw new AppError("'paciente_id' não encontrado!", 404);

    let usuarioMedicoTemp;
    if (usuario_id_medico) {
      const usuarioController = new UsuarioController();
      const usuario_medico = await usuarioController.getByID(usuario_id_medico);
      usuarioMedicoTemp = usuario_medico;
      // Se enviar o id do médico, verificar se existe
      if (usuario_id_medico && !usuario_medico)
        throw new AppError("'usuario_id_medico' não encontrado!", 404);
      // Se enviar o id do médico, verificar se é médico
      if (usuario_id_medico && usuario_medico.dataValues.tipo != "M")
        throw new AppError("'usuario_id_medico' não é médico!", 422);
    }
    const usuario_medico = usuarioMedicoTemp;

    const atributos = [
      "id",
      "paciente_id",
      "descricao",
      "status",
      "detalhes",
      "dt_inicio",
      "dt_desmarcada",
      "usuario_id_medico"
    ];
    const consulta = await Consulta.findOne({
      where: {
        id: id
      },
      attributes: atributos
    });
    if (consulta == null) {
      throw new AppError("Consulta não encontrada!", 404);
    } else {
      const consultaData = consulta.dataValues;
      // TODO: fazer o arquivo

      // Salvando log de criação
      const logConsultaController = new LogConsultaController();
      let nomeMedico;

      if (usuario_medico) {
        let nomes = usuario_medico.dataValues.nome.split(" ");
        nomeMedico = nomes[0] + " " + nomes[1].substr(0, 1);
      }
      const medicoNovo = nomeMedico;

      const log_descricao = `Consulta atualizada. ${
        descricao ? "Descrição atualizada." : ""
      } ${
        status
          ? "Status de: " + consultaData.status + " para " + status + "."
          : ""
      }${medicoNovo ? " Médico novo: " + medicoNovo + "." : "" + ""}`;

      const userId = request.userId;
      const consulta_id = consultaData.id;
      logConsultaController.create(log_descricao, userId, consulta_id);

      consulta.update({
        paciente_id: paciente_id ? paciente_id : consultaData.paciente_id,
        descricao: descricao ? descricao : consultaData.descricao,
        status: status ? status : consultaData.status,
        detalhes: detalhes ? detalhes : consultaData.detalhes,
        dt_inicio: dt_inicio ? dt_inicio : consultaData.dt_inicio,
        dt_desmarcada: dt_desmarcada
          ? dt_desmarcada
          : consultaData.dt_desmarcada,
        usuario_id_medico: usuario_id_medico
          ? usuario_id_medico
          : consultaData.usuario_id_medico
      });
      response.status(200).json(consulta);
    }
  }

  async get(request, response) {
    const atributos = [
      "id",
      "paciente_id",
      "descricao",
      "status",
      "detalhes",
      "dt_inicio",
      "dt_desmarcada",
      "usuario_id_criador",
      "usuario_id_medico"
    ];
    const consulta = await Consulta.findOne({
      where: {
        id: request.params.id
      },
      attributes: atributos
    });
    if (consulta == null) {
      throw new AppError("Consulta não encontrada!", 404);
    } else {
      // Adicionando usuários e paciente no retorno
      const usuarioController = new UsuarioController();
      const pacienteController = new PacienteController();
      consulta.dataValues.paciente = await pacienteController.getByID(
        consulta.dataValues.paciente_id
      );
      consulta.dataValues.usuario_criador = await usuarioController.getByID(
        consulta.dataValues.usuario_id_criador
      );
      consulta.dataValues.usuario_medico = await usuarioController.getByID(
        consulta.dataValues.usuario_id_medico
      );

      // Adicionando logs
      const logConsultaController = new LogConsultaController();
      consulta.dataValues.logs = await logConsultaController.getAll(
        consulta.dataValues.id
      );

      response.status(200).json(consulta);
    }
  }

  async getAll(request, response) {
    const atributos = [
      "id",
      "paciente_id",
      "descricao",
      "status",
      "detalhes",
      "dt_inicio",
      "dt_desmarcada",
      "usuario_id_criador",
      "usuario_id_medico"
    ];

    Consulta.findAndCountAll()
      .then(dados => {
        const { paginas, ...SortPaginateOptions } = SortPaginate(
          request.query,
          atributos,
          dados.count
        );
        Consulta.findAll({
          attributes: atributos,
          ...SortPaginateOptions
        })
          .then(async consultas => {
            // Adicionando usuários e paciente no retorno
            await Promise.all(
              consultas.map(async consulta => {
                const usuarioController = new UsuarioController();
                const pacienteController = new PacienteController();
                consulta.dataValues.paciente = await pacienteController.getByID(
                  consulta.dataValues.paciente_id
                );
                consulta.dataValues.usuario_criador = await usuarioController.getByID(
                  consulta.dataValues.usuario_id_criador
                );
                consulta.dataValues.usuario_medico = await usuarioController.getByID(
                  consulta.dataValues.usuario_id_medico
                );
                // Adicionando logs
                const logConsultaController = new LogConsultaController();
                consulta.dataValues.logs = await logConsultaController.getAll(
                  consulta.dataValues.id
                );
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
}

module.exports = ConsultaController;
