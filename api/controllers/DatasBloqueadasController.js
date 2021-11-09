const BloqueioDiaSemanaService = require("../services/BloqueioDiaSemanaService");
const BloqueioDataService = require("../services/BloqueioDataService");
const AppError = require("../errors/AppError");
const {
  createSemanaValidation,
  updateSemanaValidation,
  deleteSemanaValidation,
  createDiaValidation,
  getAllDiaValidation,
  updateDiaValidation,
  deleteDiaValidation
} = require("../validation/BloqueioValidation.js");

class DatasBloqueadasController {
  async createSemana(request, response) {
    try {
      await createSemanaValidation.validate(request.body, {
        abortEarly: false
      });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDiaSemanaService();
    const { dia_semana, ativo } = request.body;
    return response.status(201).json(await bds.create(dia_semana, ativo));
  }

  async getAllSemana(request, response) {
    const bds = new BloqueioDiaSemanaService();
    response.status(200).json(await bds.getAll());
  }

  async updateSemana(request, response) {
    try {
      await updateSemanaValidation.validate(request.body, {
        abortEarly: false
      });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDiaSemanaService();
    return response
      .status(200)
      .json(await bds.update(request.params.id, request.body.ativo));
  }

  async deleteSemana(request, response) {
    try {
      await deleteSemanaValidation.validate(request.query, {
        abortEarly: false
      });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDiaSemanaService();
    return response.status(204).json(await bds.delete(request.query.id));
  }

  async createDia(request, response) {
    try {
      await createDiaValidation.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDataService();
    const { data, ativo } = request.body;
    return response
      .status(201)
      .json(await bds.create(data, ativo, request.userId));
  }

  async getAllDia(request, response) {
    try {
      await getAllDiaValidation.validate(request.query, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDataService();
    const { mes, ano, ativo, simples } = request.query;
    response.status(200).json(await bds.getAll(mes, ano, ativo, simples));
  }

  async updateDia(request, response) {
    try {
      await updateDiaValidation.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDataService();
    return response
      .status(200)
      .json(await bds.update(request.params.id, request.body.ativo));
  }

  async deleteDia(request, response) {
    try {
      await deleteDiaValidation.validate(request.query, { abortEarly: false });
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    const bds = new BloqueioDataService();
    return response.status(204).json(await bds.delete(request.query.id));
  }
}

module.exports = DatasBloqueadasController;
