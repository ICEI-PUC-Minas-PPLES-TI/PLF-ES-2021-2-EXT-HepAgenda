const Paciente = require('../models/Paciente');
const { Op } = require('sequelize')
const yup = require('yup');

class PacienteController{
    async create(request, response){
        const scheme = yup.object().shape({
            nome: yup.string().max(120).required("Nome obrigatório!"),
            data_nascimento: yup.date().required("Data de nacimento obrigatória!"),
            registro_hc: yup.string().max(20).required("Registro HC obrigatório!"),
            sexo: yup.mixed().oneOf(['M', 'F']).required("Sexo do paciente obrigatório!"),
            telefone: yup.string().max(15).required("Telefone obrigatório!"),
            nome_mae: yup.string().max(120).required("Nome da mãe obrigatório!"),
            email: yup.string().max(50),
            peso: yup.number().min(0),
            altura: yup.number().min(0),
            comorbidade: yup.mixed().oneOf(['A', 'B', 'C']),
            desfecho: yup.number(),
        })

        // Validando com o esquema criado:
        try {
            await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
        } catch (err) {
            return response.status(422).json({
                'name:': err.name, // => 'ValidationError'
                'message': err.message,
                'errors': err.errors
            })
        }

        //procura um registro_hc testar se é único
        if (
            await Paciente.findOne({
                where: { registro_hc: request.body.registro_hc }
            })
        ){
            return response.status(422).json({
                'name:': "ValidationError", // => 'ValidationError'
                'message': "O registro_hc já existe",
                'errors': ["O registro_hc já existe"]
            })
        }

        if (request.body.peso){
            request.body.peso_atualizacao = new Date().toISOString().replace('T', ' ').substr(0,19)
        }
        
        const paciente = await Paciente.create({
            ...request.body
        })

        return response.status(201).json({
            created: true,
            pacienteID: paciente.id
        });
    }

    async get(request, response) {
        
        const result = await Paciente.findOne({
            where: {
              id: request.params.id
            }
        });
        response.json(result);
    }

    async getAll(request, response) {
        const result = await Paciente.findAll({ raw: true });
        response.json(result);
    }

    async update(request, response) {
        const scheme = yup.object().shape({
            id: yup.number().required("É necessário passar o id do paciente que se deseja atualizar!"),
            nome: yup.string().max(120),
            data_nascimento: yup.date(),
            registro_hc: yup.string().max(20),
            sexo: yup.mixed().oneOf(['M', 'F']),
            telefone: yup.string().max(15),
            nome_mae: yup.string().max(120),
            email: yup.string().max(50),
            peso: yup.number().min(0),
            altura: yup.number().min(0),
            comorbidade: yup.mixed().oneOf(['A', 'B', 'C']),
            desfecho: yup.number(),
        })

        // Validando com o esquema criado:
        try {
            await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
        } catch (err) {
            return response.status(422).json({
                'name:': err.name, // => 'ValidationError'
                'message': err.message,
                'errors': err.errors
            })
        }

        //procura um registro_hc testar se é único
        if (
            await Paciente.findOne({
                where: { 
                    registro_hc: request.body.registro_hc,
                    id: {
                        [Op.ne]: request.body.id
                    }
                }
            })
        ){
            return response.status(422).json({
                'name:': "ValidationError", // => 'ValidationError'
                'message': "O registro_hc já existe",
                'errors': ["O registro_hc já existe"]
            })
        }

        if (request.body.peso){
            request.body.peso_atualizacao = new Date().toISOString().replace('T', ' ').substr(0,19)
        }

        const { id, ...requestBody } = request.body;

        await Paciente.update({
            ...requestBody
        },{
            where:{ id }
        })
        return response.status(201).json({
            updated: true,
            message: "Paciente atualizado com sucesso!"
        });
    }

}

module.exports = PacienteController;