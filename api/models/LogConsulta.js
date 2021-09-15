const { Model, DataTypes } = require("sequelize");

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
          allowNull: false
        },
        consulta_id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false
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
