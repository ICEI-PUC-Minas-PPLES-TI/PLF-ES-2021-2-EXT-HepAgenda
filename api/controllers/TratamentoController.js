const Tratamento = require("../models/Tratamento");
const yup = require("yup");
const TratamentoService = require("../services/TratamentoService");
const {
  createTratamentoValidation,
  updateTratamentoValidation
} = require("../validation/TratamentoValidation");
const AppError = require("../errors/AppError");

class TratamentoController {

  async create(request, response) {
    try {
      await createTratamentoValidation.validate(request.body, {abortEarly: false});
    } catch (erro) {
      throw new AppError("Erro de validacao" + erro.message, 422)
    };

    const { identificacao, direcionado } = request.body;

    const tratamentoService = new TratamentoService();
    const tratamento = await tratamentoService.create(identificacao, direcionado);

    return response.status(201).json({
      id: tratamento.id
    });
  }

  async delete(request,response){
    const tratamentoService = new TratamentoService();
    await tratamentoService.deleteById(request.params.id);
    return response.status(204).json();
  }

  async get(request, response) {
    const tratamentoService = new TratamentoService();
    const tratamento = await tratamentoService.getById(request.params.id);
    return response.status(200).json(tratamento);
  }

  async getAll(request, response) {
    const tratamentoService = new TratamentoService();
    const {identificacao, direcionado, ativo, pagina} = request.query;
    const tratamentos = await tratamentoService.getAll(identificacao, direcionado, ativo, pagina);
    return response.status(200).json(tratamentos);
  }
}

module.exports = TratamentoController;
