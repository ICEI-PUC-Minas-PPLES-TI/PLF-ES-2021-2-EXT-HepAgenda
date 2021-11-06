const { Model, DataTypes } = require("sequelize");
const Paciente = require("./Paciente");
const Tratamento = require("./Tratamento");

class PacienteHepB extends Model {
  static init(sequelize) {
    super.init(
      {
        paciente_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: Paciente,
            key: "id"
          }
        },
        cirrotico: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        portador_inativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        fibrose: {
          type: DataTypes.ENUM(["F0", "F1", "F2", "F3", "F4", "F5"])
        },
        tratamento_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Tratamento,
            key: "id"
          }
        },
        inicio_tratamento: {
          type: DataTypes.DATE
        },
        ultimo_resultado_alfa: {
          type: DataTypes.DOUBLE
        },
        data_alfa: {
          type: DataTypes.DATE
        },
        ultimo_resultado_ultra: {
          type: DataTypes.STRING(200)
        },
        data_ultra: {
          type: DataTypes.DATE
        },
        ultimo_resultado_carga: {
          type: DataTypes.DOUBLE
        },
        data_carga: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: "paciente_hepb",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = PacienteHepB;
