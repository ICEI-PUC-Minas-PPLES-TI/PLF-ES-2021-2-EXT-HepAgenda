const { Op } = require('sequelize')
const yup = require('yup');

const Paciente = require('../models/Paciente');
const { SortPaginate } = require('../helpers/SortPaginate')
const { telefoneRegExp } = require('../helpers/Regex')

class PacienteController{
    async create(request, response){

        const scheme = yup.object().shape({
            nome: yup.string().max(120).required("Nome obrigatório!"),
            data_nascimento: yup.date().required("Data de nacimento obrigatória!"),
            registro_hc: yup.string().max(20).required("Registro HC obrigatório!"),
            sexo: yup.mixed().oneOf(['M', 'F']).required("Sexo do paciente obrigatório!"),
            telefone: yup.string().max(15).matches(telefoneRegExp).required("Telefone obrigatório!"),
            nome_mae: yup.string().max(120).required("Nome da mãe obrigatório!"),
            email: yup.string().email().max(50).nullable(),
            peso: yup.number().min(0).nullable(),
            altura: yup.number().min(0).nullable(),
            comorbidade: yup.mixed().oneOf(['HEPB', 'HEPC', 'OUTRO', null]),
            desfecho: yup.number().nullable(),
        });

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
            id: paciente.id
        });
    }

    async get(request, response) {

        const result = await Paciente.findOne({
            where: {
              id: request.params.id
            }
        });
        if (result)
            response.status(200).json(result);
        else (result)
            response.status(404).send('Paciente com esse id não encontrado')
    }

    async getByID(id) {
      const paciente = await Paciente.findOne({
        where: {
          id: id
        },
      });
      return paciente;
    }

    async getAll(request, response) {

        const atributos = ['id', 'data_nascimento', 'nome', 'email', 'telefone', 'registro_hc', 'nome_mae', 'peso', 'peso_atualizacao', 'altura'];

        Paciente.findAndCountAll()
        .then((dados) => {

            const { paginas, ...SortPaginateOptions } = SortPaginate( request.query, atributos, dados.count );

            Paciente.findAll({
                ...SortPaginateOptions
            })
            .then((pacientes) => {
                response.status(200).json({ 'dados': pacientes, 'registros': dados.count, 'paginas': paginas });
            })
            .catch( () => response.status(500).json({
                titulo: 'Erro interno do servidor',
                err
            }) );
        })
        .catch( () => response.status(500).send('Erro interno do servidor') );
    }

    async update(request, response) {

        const scheme = yup.object().shape({
            id: yup.number().required("É necessário passar o id do paciente que se deseja atualizar!"),
            nome: yup.string().max(120),
            data_nascimento: yup.date(),
            registro_hc: yup.string().max(20),
            sexo: yup.mixed().oneOf(['M', 'F']),
            telefone: yup.string().matches(telefoneRegExp).max(15),
            nome_mae: yup.string().max(120),
            email: yup.string().email().max(50),
            peso: yup.number().min(0),
            altura: yup.number().min(0),
            comorbidade: yup.mixed().oneOf(['HEPB', 'HEPC', 'OUTRO']),
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
            request.body.registro_hc && await Paciente.findOne({
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

        const paciente = await Paciente.findOne({
            where:{ id }
        });
        if (paciente){
            await paciente.update({
                ...requestBody
            })
            return response.status(201).json({
                mensagem: "Paciente atualizado com sucesso!"
            });
        }
        else{
            response.status(404).json({
                mensagem: "Paciente não encontrado"
            })
        }

    }

}

module.exports = PacienteController;
