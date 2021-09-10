const { Model, DataTypes } = require('sequelize');

class Paciente extends Model{
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome:{
                type: DataTypes.STRING(120),
                allowNull: false
            },
            data_nascimento:{
                type: DataTypes.DATE,
                allowNull: false
            },
            registro_hc: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true
            },
            sexo: {
                type: DataTypes.ENUM,
                values: ['M', 'F'],
                allowNull: false,
            },
            telefone: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            nome_mae: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            peso: {
                type: DataTypes.DOUBLE,
                allowNull: true,
                
            },
            peso_atualizacao: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            altura: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            comorbidade: {
                type: DataTypes.ENUM,
                values: ['A', 'B', 'C'],
                allowNull: true,
            },
            desfecho: {
                type: DataTypes.TINYINT(1),
                allowNull: true,
            }
        }, {
            tableName: "paciente",
            timestamps: false,
            sequelize
        })
    }
}

module.exports = Paciente;