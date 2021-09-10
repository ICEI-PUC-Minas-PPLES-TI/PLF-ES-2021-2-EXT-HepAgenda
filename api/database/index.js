require('dotenv').config()
const { Sequelize } = require('sequelize');

// Importar modelos aqui
const Tratamento = require('../models/Tratamento');
const Usuario = require('../models/Usuario');
const Paciente = require('../models/Paciente')

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  });

module.exports = {
    async connect() {
        try {
            await sequelize.authenticate();
            // Iniciar modelos aqui
            Tratamento.init(sequelize);
            Usuario.init(sequelize);
            Paciente.init(sequelize)
            if (process.env.NODE_ENV === 'dev') {
                console.log(`Conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}' estabelecida`);
            }
        } catch (error) {
            console.log(`Não foi possível estabelecer a conexão com '${process.env.DB_HOST}/${process.env.DB_DATABASE}'`);
        }
    },

    async close() {
        await sequelize.close();
    }
}