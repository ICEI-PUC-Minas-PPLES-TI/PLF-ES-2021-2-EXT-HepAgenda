const { Model, DataTypes } = require('sequelize');

class Tratamento extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            identificacao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            direcionado: {
                type: DataTypes.ENUM('HEPB', 'HEPC'),
                allowNull: false
            },
            ativo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            tableName: 'tratamento',
            timestamps: false,
            sequelize
        });
    }
}

module.exports = Tratamento;