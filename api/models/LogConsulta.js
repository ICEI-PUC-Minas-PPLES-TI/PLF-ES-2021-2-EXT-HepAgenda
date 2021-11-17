const { Model, DataTypes } = require("sequelize");
const Consulta = require("./Consulta");
const Usuario = require("./Usuario");

class LogConsulta extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        data: {
          type: DataTypes.DATE,
          allowNull: false
        },
        descricao: {
          type: DataTypes.STRING(150),
          allowNull: true
        },
        usuario_id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
          references: {
            model: Usuario,
            key: "id"
          }
        },
        consulta_id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
          references: {
            model: Consulta,
            key: "id"
          }
        }
      },
      {
        tableName: "log_consulta",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = LogConsulta;
