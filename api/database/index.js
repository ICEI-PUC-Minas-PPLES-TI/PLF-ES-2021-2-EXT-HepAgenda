require("dotenv").config();
const { Sequelize } = require("sequelize");

// Importar modelos aqui
const Consulta = require("../models/Consulta");
const Tratamento = require('../models/Tratamento');
const Usuario = require('../models/Usuario');
const Paciente = require('../models/Paciente');
const LogConsulta = require("../models/LogConsulta");
const PacienteHepB = require("../models/PacienteHepB");
const PacienteHepC = require("../models/PacienteHepC");
const Arquivo = require("../models/Arquivo");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

module.exports = {
  async connect() {
    try {
      await sequelize.authenticate();
      // Iniciar modelos aqui
      Tratamento.init(sequelize);
      Usuario.init(sequelize);
      Consulta.init(sequelize);
      Paciente.init(sequelize);
      LogConsulta.init(sequelize);
      PacienteHepB.init(sequelize);
      PacienteHepC.init(sequelize);
      Arquivo.init(sequelize);

      // Associações
      Consulta.hasMany(Arquivo, {as: 'arquivos', foreignKey: "consulta_id"});
      Arquivo.belongsTo(Consulta, {foreignKey: "consulta_id"});
      Paciente.hasOne(PacienteHepB, {foreignKey: "paciente_id"});
      Paciente.hasMany(PacienteHepC, {foreignKey: "paciente_id"});
      PacienteHepB.hasOne(Tratamento, {foreignKey: "id"})
      PacienteHepC.hasOne(Tratamento, {foreignKey: "id"})

      if (process.env.NODE_ENV === "dev") {
        console.log(
          `Conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}' estabelecida`
        );
      }
    } catch (error) {
      console.log(
        `Não foi possível estabelecer a conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}'`
      );
      console.log(error)
    }
  },

  async close() {
    await sequelize.close();
  }
};
