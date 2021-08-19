const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            login: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            nome: {
                type: DataTypes.STRING(120),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false
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
                type: DataTypes.ENUM('A','M','V'),
                allowNull: false,
                defaultValue: 'V'
            }
        }, {
            tableName: 'usuario',
            timestamps: false,
            sequelize
        });
    }
}

module.exports = Usuario;
