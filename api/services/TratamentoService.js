const AppError = require("../errors/AppError");
const Tratamento = require("../models/Tratamento");
const { Sequelize } = require("sequelize");

class TratamentoService {

  async create(identificacao, direcionado) {
    const tratamento = await Tratamento.create({
      identificacao,
      direcionado
    })
    return tratamento;
  }

  async deleteById(id) {
    const tratamento = await this.getById(id);
    if (!tratamento) throw new AppError("Tratamento não encontrado!", 404);
    await tratamento.update({
      ativo: false
    });
  }

  async getById(id) {
    const tratamento = await Tratamento.findOne({
      where: {
        id: id
      }
    });
    if (!tratamento) throw new AppError("Tratamento não encontrado!", 404);
    return tratamento;
  }

  async getAll(identificacao = null, direcionado = null, ativo = null) {
    console.log(identificacao, direcionado, ativo);

    const tratamentos = await Tratamento.findAll({
      where: Sequelize.literal(
        `identificacao ${
          identificacao ? ` LIKE %${identificacao}%` : "IS NOT NULL"
        } && direcionado ${
          direcionado ? ` = ${direcionado}` : "IS NOT NULL"
        } && ativo ${ativo ? `= ${ativo}` : "IS NOT NULL"}`
      )
    });
    return tratamentos;
  }
}

//const escapedSearch = sequelize.escape(`%${myVar}%`);
//sequelize.literal(`"foo".name ILIKE ${escapedSearch}`);

module.exports = TratamentoService;
