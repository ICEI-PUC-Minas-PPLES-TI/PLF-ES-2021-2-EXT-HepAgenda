const { Model, DataTypes } = require("sequelize");

class BloqueioDiaSemana extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        dia_semana: {
          type: DataTypes.TINYINT,
          allowNull: false
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        tableName: "bloqueio_diasemana",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = BloqueioDiaSemana;
