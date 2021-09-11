const Tratamento = require("../models/Tratamento");
const yup = require("yup");

class TratamentoController {
  async create(request, response) {
    const scheme = yup.object().shape({
      identificacao: yup.string().required("Identificação obrigatório!"),
      direcionado: yup
        .mixed()
        .oneOf(["HEPB", "HEPC"])
        .required("Direcionado obrigatório")
    });

    // Validando com o esquema criado:
    try {
      await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (err) {
      return response.status(422).json({
        "name:": err.name, // => 'ValidationError'
        message: err.message,
        errors: err.errors
      });
    }

    const { identificacao, direcionado } = request.body;

    const tratamento = await Tratamento.create({
      identificacao,
      direcionado
    });

    return response.status(201).json({
      created: true,
      tratamentoID: tratamento.id
    });
  }

  async get(request, response) {
    const result = await Tratamento.findAll({
      where: {
        id: request.params.id
      }
    });
    response.json(result);
  }

  async getAll(request, response) {
    const result = await Tratamento.findAll({ raw: true });
    response.json(result);
  }
}

module.exports = TratamentoController;
