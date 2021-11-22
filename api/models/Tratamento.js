const { Model, DataTypes } = require("sequelize");

class Tratamento extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(10),
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        identificacao: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        direcionado: {
          type: DataTypes.ENUM("HEPB", "HEPC", "OUTRO"),
          allowNull: false
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        tableName: "tratamento",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = Tratamento;
