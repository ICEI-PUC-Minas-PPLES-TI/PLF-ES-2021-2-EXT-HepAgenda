const BloqueioDiaSemanaService = require("../services/BloqueioDiaSemanaService");
const BloqueioDataService = require("../services/BloqueioDataService");
const AppError = require("../errors/AppError");
const yup = require('yup');

class DatasBloqueadasController {
  async createSemana(request, response) {
    const scheme = yup.object().shape({
      dia_semana: yup
        .number("'dia_semana' deve ser numérico!")
        .min(0)
        .max(6)
        .required("'dia_semana' obrigatório!"),
      ativo: yup
        .boolean()
        .required("'ativo' obrigatório!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
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
    const scheme = yup.object().shape({
      ativo: yup
        .boolean()
        .required("'ativo' obrigatório!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDiaSemanaService();
    return response.status(200).json(await bds.update(request.params.id, request.body.ativo));
  }

  async deleteSemana(request, response) {
    const scheme = yup.object().shape({
      id: yup
        .number()
        .required("'id' obrigatório!")
    });
    try {
      await scheme.validate(request.query, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDiaSemanaService();
    return response.status(204).json(await bds.delete(request.query.id));
  }

  async createDia(request, response) {
    const scheme = yup.object().shape({
      data: yup
        .date()
        .required("'data' obrigatório!"),
      ativo: yup
        .boolean()
        .required("'ativo' obrigatório!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDataService();
    const { data, ativo } = request.body;
    return response.status(201).json(await bds.create(data, ativo, request.userId));
  }

  async getAllDia(request, response) {
    const scheme = yup.object().shape({
      ano: yup
        .number()
        .min(1900)
        .max(3000)
        .nullable(),
      mes: yup
        .number()
        .min(1)
        .max(12)
        .nullable(),
      ativo: yup
        .boolean()
        .nullable(),
      simples: yup
        .boolean()
        .nullable(),
    });

    try {
      await scheme.validate(request.query, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDataService();
    const {mes, ano, ativo, simples} = request.query
    response.status(200).json(await bds.getAll(mes, ano, ativo, simples));
  }

  async updateDia(request, response) {
    const scheme = yup.object().shape({
      ativo: yup
        .boolean()
        .required("'ativo' obrigatório!")
    });

    try {
      await scheme.validate(request.body, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDataService();
    return response.status(200).json(await bds.update(request.params.id, request.body.ativo));
  }

  async deleteDia(request, response) {
    const scheme = yup.object().shape({
      id: yup
        .number()
        .required("'id' obrigatório!")
    });
    try {
      await scheme.validate(request.query, { abortEarly: false });
    } catch (erro) {
      throw new AppError(erro.message, 422);
    }

    const bds = new BloqueioDataService();
    return response.status(204).json(await bds.delete(request.query.id));
  }
}

module.exports = DatasBloqueadasController;
