const { Model, DataTypes } = require("sequelize");

class BloqueioData extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        data: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        usuario_id_criador: {
          type: DataTypes.INTEGER,
          required: true
        },
      },
      {
        tableName: "bloqueio_data",
        timestamps: false,
        sequelize
      }
    );
  }
}

module.exports = BloqueioData;
