const { Model, DataTypes } = require("sequelize");

class Paciente extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: DataTypes.STRING(120),
          allowNull: false
        },
        data_nascimento: {
          type: DataTypes.DATE,
          allowNull: false
        },
        ativo: {
          type: DataTypes.TINYINT(1)
        },
        registro_hc: {
          type: DataTypes.STRING(20),
          allowNull: true,
          isUnique: (value, next) => {
            Paciente.findAll({
              where: { registro_hc: value },
              attributes: ["id"]
            })
              .then(usuario => {
                if (usuario.length != 0)
                  next(
                    new AppError("Registro hc já cadastrado!", 422, [
                      "'registro_hc' já cadastrado!"
                    ])
                  );
                next();
              })
              .catch(error => {
                next(new AppError("Erro interno no servidor!", 500, error));
              });
          }
        },
        sexo: {
          type: DataTypes.ENUM,
          values: ["M", "F"],
          allowNull: false
        },
        telefone: {
          type: DataTypes.STRING(15),
          allowNull: false
        },
        nome_mae: {
          type: DataTypes.STRING(120),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        peso: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        peso_atualizacao: {
          type: DataTypes.TIME,
          allowNull: true
        },
        altura: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        comorbidade: {
          type: DataTypes.ENUM,
          values: ["HEPB", "HEPC", "HEPBC", "OUTRO"],
          allowNull: true
        },
        desfecho: {
          type: DataTypes.TINYINT(1),
          allowNull: true
        }
      },
      {
        tableName: "paciente",
        timestamps: false,
        modelName: 'paciente',
        freezeTableName: true,
        sequelize
      }
    );
  }
}

module.exports = Paciente;
