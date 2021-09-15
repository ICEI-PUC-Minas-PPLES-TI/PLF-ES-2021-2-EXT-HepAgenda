const LogConsulta = require("../models/LogConsulta");
const yup = require("yup");
const AppError = require("../errors/AppError");

class LogConsultaController {
  async create(descricao, usuario_id, consulta_id) {
    const tempoAgora = Date.now();
    const hoje = new Date(tempoAgora);
    const log = {};
    log.data = hoje.toUTCString();
    log.descricao = descricao;
    log.usuario_id = usuario_id;
    log.consulta_id = consulta_id;
    const scheme = yup.object().shape({
      descricao: yup
        .string("'descricao' deve ser string!")
        .max(150, "'descricao' deve ter no máximo 150 caracteres!"),
      usuario_id: yup
        .number("'usuario_id' deve ser numérico!")
        .required("'usuario_id' obrigatório!"),
      consulta_id: yup
        .number("'consulta_id' deve ser numérico!")
        .required("'consulta_id' obrigatório!")
    });

    try {
      await scheme.validate(log, { abortEarly: false });
    } catch (err) {
      throw new AppError(err.message, 422);
    }

    await LogConsulta.create({
      data: log.data,
      descricao: log.descricao,
      usuario_id: log.usuario_id,
      consulta_id: log.consulta_id
    })
      .then(log => {
        return log;
      })
      .catch(erro => {
        throw new AppError(erro.message, 500);
      });
  }

  async getAll(id_consulta) {
    const logs = await LogConsulta.findAll({
      where: {
        consulta_id: id_consulta
      },
    });
    return logs;
  }
}

module.exports = LogConsultaController;
