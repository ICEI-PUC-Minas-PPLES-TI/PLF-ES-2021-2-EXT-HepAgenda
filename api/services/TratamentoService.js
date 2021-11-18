const AppError = require("../errors/AppError");
const Tratamento = require("../models/Tratamento");
const { Sequelize, Op } = require("sequelize");

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

  async update(id, identificacao, direcionado, ativo){
    const tratamento = await Tratamento.findOne({
      where: {
        id: id
      }
    });
    if (tratamento == null) {
      throw new AppError("Tratamento não encontrado!", 404);
    }
    await tratamento.update({
      identificacao, direcionado, ativo
    });

    return {
      updated: true
    };
  }

  async getAll(identificacao = null, direcionado = null, ativo = null, pagina = 1) {
    let filtro = {
      [Op.and]:[]
    }
    if(ativo){
      filtro[Op.and].push({ativo:ativo})
    }
    if(direcionado){
      filtro[Op.and].push({direcionado:direcionado})
    }
    if(identificacao){
      filtro[Op.and].push({identificacao:{[Op.like]:`%${identificacao}%`}})
    }
    const limite = 20;
    const offset = 0;
    const tratamentos = await Tratamento.findAndCountAll({
      where: filtro,
      limit:limite,
      offset:(pagina-1)*limite
    });
    return {
      dados:tratamentos.rows,
      quantidade: tratamentos.rows.length,
      total:tratamentos.count,
      paginas:Math.ceil(tratamentos.count/limite),
      offset: offset
    };
  }

}

module.exports = TratamentoService;
