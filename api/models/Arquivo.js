const { Model, DataTypes } = require("sequelize");
const Consulta = require("../models/Consulta");

class Arquivo extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        consulta_id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          allowNull: false,
          references: {
            model: Consulta,
            key: "id"
          }
        },
        nome: {
          type: DataTypes.STRING(45),
          allowNull: false
        },
        link: {
          type: DataTypes.STRING(120),
          allowNull: false
        },
        data_criado: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        tableName: "arquivo",
        timestamps: false,
        createdAt: "data_criado",
        sequelize
      }
    );
  }
}

module.exports = Arquivo;
