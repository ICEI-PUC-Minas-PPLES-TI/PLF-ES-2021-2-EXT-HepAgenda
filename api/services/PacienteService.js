const Paciente = require("../models/Paciente");

class PacienteService {
  async getById(id, atributos) {
    const paciente = await Paciente.findOne({
      where: {
        id: id
      },
      attributes: atributos
    });
    return paciente;
  }
}

module.exports = PacienteService;
