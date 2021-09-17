const { Model, DataTypes } = require('sequelize');
const Paciente = require('./Paciente');
const Tratamento = require('./Tratamento');

class PacienteHepC extends Model{
    static init (sequelize){
        super.init({
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            paciente_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Paciente,
                    key: 'id'
                }
            },
            cirrotico: {
                type: DataTypes.TINYINT(1),
                allowNull: false
            },
            portador_inativo: {
                type: DataTypes.TINYINT(1),
                allowNull: false
            },
            fibrose: {
                type: DataTypes.ENUM(['F0', 'F1', 'F2', 'F3', 'F4', 'F5']),
                allowNull: false
            },
            tratado: {
                type: DataTypes.TINYINT(1)
            },
            tratamento_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Tratamento,
                    key: 'id'
                }
            },
            num_tratamentos: {
                type: DataTypes.TINYINT.UNSIGNED,
            },
            ultimo_resultado_alfa: {
                type: DataTypes.DOUBLE,
            },
            data_alfa: {
                type: DataTypes.DATE,
            },
            ultimo_resultado_alfa: {
                type: DataTypes.DOUBLE,
            },
            data_alfa: {
                type: DataTypes.DATE,
            },
            ultimo_resultado_ultra: {
                type: DataTypes.DOUBLE,
            },
            data_ultra: {
                type: DataTypes.DATE,
            },
            ultimo_resultado_carga: {
                type: DataTypes.DOUBLE,
            },
            data_carga: {
                type: DataTypes.DATE,
            },
        }, {
            tableName: "paciente_hepc",
            timestamps: false,
            sequelize
        })

    }
}
module.exports = PacienteHepC