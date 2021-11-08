const { Op } = require("sequelize");
const yup = require("yup");

const { SortPaginate } = require("../helpers/SortPaginate");
const AppError = require("../errors/AppError");

const Consulta = require("../models/Consulta");
const Arquivo = require("../models/Arquivo");

const ConsultaService = require("../services/ConsultaService");

const {
  createConsultaValidation, updateConsultaValidation
} = require("../validation/ConsultaValidation");

const ArquivoService = require("../services/ArquivoService");
const LogConsultaService = require("../services/LogConsultaService");

class ConsultaController {
  async create(request, response) {
    const scheme = createConsultaValidation;

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

    const consultaService = new ConsultaService();
    const consulta = await consultaService.create(
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      usuario_id_medico,
      request.userId
    );

    return response.status(201).json({
      id: consulta.id
    });
  }

  async update(request, response) {
    const scheme = updateConsultaValidation;

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

    const consultaService = new ConsultaService();
    await consultaService.update(
      id,
      paciente_id,
      descricao,
      status,
      detalhes,
      dt_inicio,
      usuario_id_medico,
      request.files,
      request.userId
    );

    return response.status(200).json({});
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
    consulta.dataValues.paciente = await pacienteService.findById(
      consulta.dataValues.paciente_id
    );
    consulta.dataValues.usuario_criador = await usuarioService.findById(
      consulta.dataValues.usuario_id_criador
    );
    consulta.dataValues.usuario_medico = await usuarioService.findById(
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
                consulta.dataValues.paciente = await pacienteService.findById(
                  consulta.dataValues.paciente_id,
                  atributosPaciente
                );
                // Adicionando dados do médico associado a consulta
                consulta.dataValues.usuario_medico = await usuarioService.findById(
                  consulta.dataValues.usuario_id_medico,
                  atributosMedico
                );
                // * Desativado: Adicionando dados do criador da consulta
                // consulta.dataValues.usuario_criador = await usuarioService.findById(
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
    const paciente = await pacienteService.findById(paciente_id);
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
