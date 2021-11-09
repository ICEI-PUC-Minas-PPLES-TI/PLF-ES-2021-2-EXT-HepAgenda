const { Model, DataTypes } = require("sequelize");
const Paciente = require("./Paciente");
const Usuario = require("./Usuario");

class Consulta extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        paciente_id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
          references: {
            model: Paciente,
            key: "id"
          }
        },
        descricao: {
          type: DataTypes.STRING(60),
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM(
            "AGUARDANDOC",
            "AGUARDANDOA",
            "REALIZADO",
            "CANCELADO"
          ),
          allowNull: false,
          defaultValue: "AGUARDANDOC"
        },
        detalhes: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        dt_inicio: {
          type: DataTypes.DATE,
          allowNull: false
        },
        dt_desmarcada: {
          type: DataTypes.DATE,
          allowNull: true
        },
        usuario_id_criador: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
          references: {
            model: Usuario,
            key: "id"
          }
        },
        usuario_id_medico: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: true,
          references: {
            model: Usuario,
            key: "id"
          }
        }
      },
      {
        tableName: "consulta",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = Consulta;
