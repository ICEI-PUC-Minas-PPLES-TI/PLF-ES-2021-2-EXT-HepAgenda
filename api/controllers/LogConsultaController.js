const LogConsultaService = require("../services/LogConsultaService");

class LogConsultaController {
  async getAll(id_consulta) {
    const logConsultaService = LogConsultaService();
    const logs = await logConsultaService.getAll(id_consulta);
    return logs;
  }
}

module.exports = LogConsultaController;
