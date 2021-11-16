const BloqueioDiaSemana = require("../models/BloqueioDiaSemana");
const AppError = require("../errors/AppError");

class BloqueioDiaSemanaService {

  /** Cria um novo bloqueio de data na semana
   * 
   * @param {*} diaSemana 
   * @param {*} ativo 
   * @author Henrique
   * @returns object
   */
  async create(diaSemana, ativo){
    const bloqueioExiste = await BloqueioDiaSemana.findOne({
      where: {
        dia_semana: diaSemana
      }
    });
    if(bloqueioExiste)
      return this.update(bloqueioExiste.id, ativo)

    const bloqueio = await BloqueioDiaSemana.create({
      dia_semana: diaSemana,
      ativo
    });

    return {
      created: true,
      bloqueioID: bloqueio.id
    };
  }

  /**
   * Retorna se existe bloqueio de dia de semana (Existindo no banco ou não)
   * 
   * @author Henrique
   * @returns array
   */
  async getAll() {
    const semana = await BloqueioDiaSemana.findAll();
    let result = [
      {diasemana: 0, ativo: false}, // Domingo ...
      {diasemana: 1, ativo: false},
      {diasemana: 2, ativo: false},
      {diasemana: 3, ativo: false},
      {diasemana: 4, ativo: false},
      {diasemana: 5, ativo: false},
      {diasemana: 6, ativo: false}, // ... Sábado
    ]
    semana.forEach(element => {
      result[element.dia_semana].ativo = element.ativo
    });
    return result;
  }

  /**
   * Atualiza o bloqueio semanal
   * 
   * @param {*} id 
   * @param {*} ativo 
   * @author Henrique
   * @returns 
   */
  async update(id, ativo){
    const bloqueioExiste = await BloqueioDiaSemana.findByPk(id);
    if(!bloqueioExiste)
      throw new AppError("Bloqueio da Semana nao encontrado", 404)

    
    await bloqueioExiste.update({
      ativo
    });

    return {
      updated: true
    };
  }

  /**
   * Deleta (Sem soft delete) o bloqueio semanal
   * 
   * @param {*} id 
   * @returns 
   */
  async delete(id){
    const bloqueioExiste = await BloqueioDiaSemana.findByPk(id);
    if(!bloqueioExiste)
      throw new AppError("Bloqueio da Semana nao encontrado", 404)

    
    await bloqueioExiste.destroy(id);

    return {
      deleted: true
    };
  }
  
}

module.exports = BloqueioDiaSemanaService;
