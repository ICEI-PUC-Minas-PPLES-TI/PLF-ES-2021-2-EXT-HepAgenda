const { Model, DataTypes } = require("sequelize");
const AppError = require("../errors/AppError");

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(11).UNSIGNED,
          required: true,
          primaryKey: true,
          autoIncrement: true
        },
        login: {
          type: DataTypes.STRING(30),
          allowNull: true,
          validate: {
            isUnique: (value, next) => {
              Usuario.findAll({
                where: { login: value },
                attributes: ["id"]
              })
                .then(usuario => {
                  if (usuario.length != 0)
                    next(new AppError("Login já utilizado!"));
                  next();
                })
                .catch(onError => console.log(onError));
            }
          }
        },
        nome: {
          type: DataTypes.STRING(120),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            isUnique: (value, next) => {
              Usuario.findAll({
                where: { email: value },
                attributes: ["id"]
              })
                .then(usuario => {
                  if (usuario.length != 0)
                    next(new AppError("Email já cadastrado!"));
                  next();
                })
                .catch(onError => console.log(onError));
            }
          }
        },
        telefone: {
          type: DataTypes.STRING(15),
          allowNull: true
        },
        senha: {
          type: DataTypes.STRING(64),
          allowNull: false
        },
        data_excluido: {
          type: DataTypes.DATE,
          allowNull: true
        },
        data_expira: {
          type: DataTypes.DATE,
          allowNull: true
        },
        tipo: {
          type: DataTypes.ENUM("A", "M", "V"),
          allowNull: false,
          defaultValue: "V"
        }
      },
      {
        tableName: "usuario",
        timestamps: true, // deletedAt precisa disso true
        paranoid: true, // deletedAt precisa disso true
        deletedAt: "data_excluido",
        createdAt: false,
        updatedAt: false,
        sequelize
      }
    );
  }
}

module.exports = Usuario;
