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
                    next(
                      new AppError("Login já utilizado!", 422, [
                        `'login' já utilizado!`
                      ])
                    );
                  next();
                })
                .catch(error => {
                  next(new AppError("Erro interno no servidor!", 500, error));
                });
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
                    next(
                      new AppError("Usuário não encontrado!", 404, [
                        `Usuário de 'email' ${email} não encontrado!`
                      ])
                    );
                  next();
                })
                .catch(error => {
                  next(new AppError("Erro interno no servidor!", 500, error));
                });
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
        sequelize,
        defaultScope: {
          attributes: {
            exclude: ["senha"]
          }
        }
      }
    );
  }
}

module.exports = Usuario;
