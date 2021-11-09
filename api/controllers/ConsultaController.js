const yup = require("yup");

const AppError = require("../errors/AppError");

const ConsultaService = require("../services/ConsultaService");

const {
  createConsultaValidation,
  updateConsultaValidation
} = require("../validation/ConsultaValidation");

const PacienteService = require("../services/PacienteService");

class ConsultaController {

  // URI de exemplo: POST http://localhost:3000/api/consulta/
  // Campos são passados em raw json
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

  // URI de exemplo: UPDATE http://localhost:3000/api/consulta/idNumerico
  // Campos são passados em form-data
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

  // URI de exemplo: GET http://localhost:3000/api/consulta/idNumerico
  async get(request, response) {
    const consultaService = new ConsultaService();
    const consulta = await consultaService.getById(request.params.id);
    return response.status(200).json(consulta);
  }

  // URI de exemplo: GET http://localhost:3000/api/consulta?pagina=1&limite=5&atributo=id&ordem=ASC&camposCriador=id,nome&camposPaciente=id,nome&camposMedico=id,nome&dataInicio=2021-09-18&dataFim=2021-11-20&status=AC,AA,R,C
  // Todas as querys são opicionais
  async getAll(request, response) {
    const consultaService = new ConsultaService();
    const consultas = await consultaService.getAll(request.query);

    return response.status(200).json({
      dados: consultas.dados,
      quantidade: consultas.quantidade,
      total: consultas.total,
      paginas: consultas.paginas,
      offset: consultas.offset
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
