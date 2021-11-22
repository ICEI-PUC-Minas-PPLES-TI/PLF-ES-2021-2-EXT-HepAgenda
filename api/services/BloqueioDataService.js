const BloqueioData = require("../models/BloqueioData");
const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const { Sequelize } = require("sequelize");

class BloqueioDataService {
  /** Cria um novo bloqueio de data
   *
   * @param {*} data
   * @param {*} ativo
   * @param {*} usuarioID Usuario autenticado
   * @author Henrique
   * @returns object
   */
  async create(data, ativo, usuarioID) {
    const bloqueioExiste = await BloqueioData.findOne({
      where: {
        data
      }
    });
    if (bloqueioExiste)
      throw new AppError("Bloqueio no dia já existe!", 405, [
        "Neste dia já existe um bloqueio!"
      ]);

    const bloqueio = await BloqueioData.create({
      data,
      ativo,
      usuario_id_criador: usuarioID
    });

    return {
      created: true,
      bloqueioID: bloqueio.id
    };
  }

  /**
   * Retorna se existe bloqueio no dia
   *
   * @param {*} mes
   * @param {*} ano
   * @author Henrique
   * @returns array
   */
  async getAll(mes = null, ano = null, ativo = null, simple = 1) {
    const dias = await BloqueioData.findAll({
      include:
        simple != 0
          ? [
              {
                model: Usuario,
                as: "usuario",
                attributes: ["id", "nome"]
              }
            ]
          : null,
      where: Sequelize.literal(
        `YEAR(\`data\`) >= ${ano || 1900} AND YEAR(\`data\`) <= ${ano ||
          3000} && MONTH(\`data\`) >= ${mes || 1} && MONTH(\`data\`) <= ${mes ||
          12} && ativo ${ativo ? ` = ${ativo}` : "IS NOT NULL"}`
      )
    });
    return dias;
  }

  /**
   * Atualiza o bloqueio do dia
   *
   * @param {*} id
   * @param {*} ativo
   * @author Henrique
   * @returns
   */
  async update(id, ativo) {
    const bloqueioExiste = await BloqueioData.findByPk(id);
    if (!bloqueioExiste)
      throw new AppError("Bloqueio no dia não encontrado!", 404, [
        "Bloqueio não encontrado para este dia!"
      ]);

    await bloqueioExiste.update({
      ativo
    });

    return {
      updated: true
    };
  }

  /**
   * Deleta (Sem soft delete) o bloqueio
   *
   * @param {*} id
   * @returns
   */
  async delete(id) {
    const bloqueioExiste = await BloqueioData.findByPk(id);
    if (!bloqueioExiste)
      throw new AppError("Bloqueio no dia não encontrado!", 404, [
        "Bloqueio não encontrado para este dia!"
      ]);

    await bloqueioExiste.destroy(id);

    return {
      deleted: true
    };
  }
}

module.exports = BloqueioDataService;
