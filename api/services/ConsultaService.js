const Consulta = require("../models/Consulta");

class ConsultaService {
  async getByPacienteId(idPaciente) {
    const consulta = await Consulta.findOne({
      where: {
        paciente_id: idPaciente
      }
    });
    return consulta;
  }
}

module.exports = ConsultaService;
