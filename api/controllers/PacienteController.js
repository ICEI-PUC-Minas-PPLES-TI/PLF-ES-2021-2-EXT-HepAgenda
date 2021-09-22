const { Op } = require('sequelize')
const yup = require('yup');

const Paciente = require('../models/Paciente');
const { SortPaginate } = require('../helpers/SortPaginate')
const PacienteHepB = require('../models/PacienteHepB');
const PacienteHepC = require('../models/PacienteHepC');
const { pacienteCreateScheme, pacienteUpdateScheme, hepatiteRequiredScheme } = require('../validation/PacienteValidation');

class PacienteController{
    async create(request, response){
        
        const scheme = pacienteCreateScheme;

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

        // atualiza o peso_atualizao se o peso for atualizado
        if (request.body.peso){
            request.body.peso_atualizacao = new Date().toISOString().replace('T', ' ').substr(0,19)
        }

        let hepcIds = [];
        const paciente = await Paciente.create({
            ...request.body,
            comorbidade: 
                request.body.hepatiteb ? 'HEPB' : request.body.hepatitec ? 'HEPC' : 'OUTRO'
        });
        if (request.body.hepatiteb){
            await PacienteHepB.create({
                paciente_id: paciente.id,
                ...request.body.hepatiteb
            });
        }
        else if (request.body.hepatitec){
            await Promise.all(
                request.body.hepatitec.map((hepc)=>{
                    return PacienteHepC.create({
                        paciente_id: paciente.id,
                        ...hepc
                    }).then((pacienteHepC)=>{
                        hepcIds.push(pacienteHepC.id)
                    })
                })
            )
        }

        return response.status(201).json({
            id: paciente.id,
            hepcIds
        });
    }

    async get(request, response) {
        
        const result = await Paciente.findOne({
            where: {
              id: request.params.id
            },
            include: {
                all: true
            }
        });
        if (result)
            response.status(200).json(result);
        else
            response.status(404).send('Paciente com esse id não encontrado')
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
        const scheme = pacienteUpdateScheme;

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

        const { id, hepatiteb, hepatitec, ...requestBody } = request.body;

        const paciente = await Paciente.findOne({
            where:{ id }
        });
        if (paciente){
            await paciente.update({
                ...requestBody
            })
            if ( hepatiteb ){
                // se o hepatiteb já exsitir para esse paciente, apenas atualiza, se não cria um
                const pacienteHepatiteB = await PacienteHepB.findOne({
                    where: { paciente_id: id }
                })
                if (pacienteHepatiteB){
                    await pacienteHepatiteB.update({
                        ...hepatiteb
                    })
                }
                else{
                    // Revalida dados, pois para criação há atributos obrigatórios
                    try {
                        await hepatiteRequiredScheme.validate(hepatiteb, { abortEarly: false }); // AbortEarly para fazer todas as validações
                    } catch (err) {
                        return response.status(422).json({
                            'name:': err.name, // => 'ValidationError'
                            'message': err.message,
                            'errors': err.errors
                        })
                    }
                    await PacienteHepB.create({
                        ...hepatiteb,
                        paciente_id: paciente.id
                    })
                }
            }
            else if (hepatitec){
                // percorre todo vetor de hepatitec, criando ou atualizando os dados
                await Promise.all(
                    hepatitec.map(async (hepc)=>{
                        console.log(hepc);
                        // se o hepatitec já exsitir para esse paciente, apenas atualiza, se não cria um
                        const pacienteHepatiteC = await PacienteHepC.findOne({
                            where: { id: hepc.id??0 }
                        })
                        if (pacienteHepatiteC){
                            await pacienteHepatiteC.update({
                                ...hepc
                            })
                        }
                        else{

                            // Revalida dados, pois para criação há atributos obrigatórios
                            try {
                                await hepatiteRequiredScheme.validate(hepc, { abortEarly: false }); // AbortEarly para fazer todas as validações
                            } catch (err) {
                                return response.status(422).json({
                                    'name:': err.name, // => 'ValidationError'
                                    'message': err.message,
                                    'errors': err.errors
                                })
                            } 
                            await PacienteHepC.create({
                                ...hepc,
                                paciente_id: paciente.id
                            })
                        }
                    })
                )
                
            }
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