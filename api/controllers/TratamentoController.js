const TratamentoService = require("../services/TratamentoService");
const {
  createTratamentoValidation
} = require("../validation/TratamentoValidation");
const AppError = require("../errors/AppError");

class TratamentoController {

  async create(request, response) {
    try {
      await createTratamentoValidation.validate(request.body, {abortEarly: false});
    } catch (erro) {
      throw new AppError(erro.name, 422, erro.errors);
    };

    const { identificacao, direcionado } = request.body;

    const tratamentoService = new TratamentoService();
    const tratamento = await tratamentoService.create(identificacao, direcionado);

    return response.status(201).json({
      id: tratamento.id
    });
  }

  async update(request, response) {
    try {
      await updateTratamentoValidation.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.name, 422, erro.message);
    }

    const service = new TratamentoService();
    return response.status(200).json(await service.update(request.params.id, request.body.identificacao, request.body.direcionado, request.body.ativo));
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
