require("dotenv").config();
const { Sequelize } = require("sequelize");

// Importar modelos aqui
const Consulta = require("../models/Consulta");
const Tratamento = require("../models/Tratamento");
const Usuario = require("../models/Usuario");
const Paciente = require("../models/Paciente");
const LogConsulta = require("../models/LogConsulta");
const PacienteHepB = require("../models/PacienteHepB");
const PacienteHepC = require("../models/PacienteHepC");
const BloqueioDiaSemana = require("../models/BloqueioDiaSemana");
const BloqueioData = require("../models/BloqueioData");
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
      Usuario.init(sequelize);
      Tratamento.init(sequelize);
      Paciente.init(sequelize);
      PacienteHepB.init(sequelize);
      PacienteHepC.init(sequelize);
      Consulta.init(sequelize);
      LogConsulta.init(sequelize);
      Arquivo.init(sequelize);
      BloqueioDiaSemana.init(sequelize);
      BloqueioData.init(sequelize);

      // Associações
      Consulta.hasMany(Arquivo, { as: "arquivos", foreignKey: "consulta_id" }); // Uma consulta possui vários arquivos
      Arquivo.belongsTo(Consulta, { as: "consulta", foreignKey: "consulta_id" }); // Um arquivo pertence a uma consulta
      Consulta.hasMany(LogConsulta, { as: "logs", foreignKey: "consulta_id" }); // Uma consulta possui vários logs
      LogConsulta.belongsTo(Consulta, { foreignKey: "consulta_id" }); // Um log pertence a uma consulta
      Usuario.hasMany(LogConsulta, { as: "logs_gerados", foreignKey: "id" }); // Um usuário possui vários logs gerados
      LogConsulta.belongsTo(Usuario, { foreignKey: "usuario_id" }); // Um log pertence a um usuário
      Usuario.hasMany(Consulta, { as: "consultas_criadas", foreignKey: "usuario_id_criador" }); // Um usuário possui/cria/possui várias consultas
      Consulta.belongsTo(Usuario, { as: "usuario_criador", foreignKey: "usuario_id_criador" }); // Uma consulta pertence a um usuário criador
      Usuario.hasMany(Consulta, { as: "consultas_acompanhandas", foreignKey: "usuario_id_medico" }); // Um usuário médico possui/realiza várias consultas
      Consulta.belongsTo(Usuario, { as: "usuario_medico", foreignKey: "usuario_id_medico" }); // Uma consulta é/realizada de/por um usuário médico
      Consulta.belongsTo(Paciente, { as: "paciente", foreignKey: "paciente_id" }); // Uma consulta pertence a um paciente
      Paciente.hasMany(Consulta, { as: "consultas_feitas", foreignKey: "paciente_id" }); // Um paciente possui várias consultas
      Paciente.hasOne(PacienteHepB, { foreignKey: "paciente_id" });
      Paciente.hasMany(PacienteHepC, { foreignKey: "paciente_id" });
      PacienteHepB.hasOne(Tratamento, { foreignKey: "id" });
      PacienteHepC.hasOne(Tratamento, { foreignKey: "id" });
      Paciente.hasMany(Consulta, { foreignKey: "paciente_id" });
      Paciente.hasOne(Consulta, { as: 'uconsulta', foreignKey: "paciente_id" });
      BloqueioData.belongsTo(Usuario, {foreignKey: "usuario_id_criador", as: 'usuario'});

      if (process.env.NODE_ENV === "dev") {
        console.log(
          `Conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}' estabelecida`
        );
      }
    } catch (error) {
      console.log(
        `Não foi possível estabelecer a conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}'`
      );
      console.log(error);
    }
  },

  async close() {
    await sequelize.close();
  }
};
