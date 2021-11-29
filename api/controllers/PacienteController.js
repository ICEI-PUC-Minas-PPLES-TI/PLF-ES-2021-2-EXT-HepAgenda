const { Op } = require('sequelize')
const yup = require('yup');

const Paciente = require('../models/Paciente');
const { SortPaginate } = require('../helpers/SortPaginate')
const PacienteHepB = require('../models/PacienteHepB');
const PacienteHepC = require('../models/PacienteHepC');
const PacienteService = require("../services/PacienteService");
const { pacienteCreateScheme, pacienteUpdateScheme, hepatiteRequiredScheme } = require('../validation/PacienteValidation');
const Consulta = require('../models/Consulta');
const Tratamento = require('../models/Tratamento');

class PacienteController {
  async create(request, response) {

    const scheme = pacienteCreateScheme;

    // Validando com o esquema criado:
    try {
      await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }


    if (request.body.registro_hc) {
      //procura um registro_hc testar se é único (caso venha)
      if (
        await Paciente.findOne({
          where: { registro_hc: request.body.registro_hc }
        })
      ) {
        throw new AppError("O registro HC já existe!", 422, ["O 'registro_hc' já existe!"]);
      }
    }

    // atualiza o peso_atualizao se o peso for atualizado
    if (request.body.peso) {
      request.body.peso_atualizacao = new Date().toISOString().replace('T', ' ').substr(0, 19)
    }

    let hepcIds = [];
    const paciente = await Paciente.create({
      ...request.body
    });
    if (request.body.hepatiteb) {
      await PacienteHepB.create({
        paciente_id: paciente.id,
        ...request.body.hepatiteb
      });
    }
    if (request.body.hepatitec) {
      await Promise.all(
        request.body.hepatitec.map((hepc) => {
          return PacienteHepC.create({
            paciente_id: paciente.id,
            ...hepc
          }).then((pacienteHepC) => {
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

  async getAll(request, response) {
    const atributos = ['id', 'data_nascimento', 'nome', 'email', 'telefone', 'registro_hc', 'nome_mae', 'peso', 'peso_atualizacao', 'altura'];

    let search = request.query.pesquisar
    const where = [];

    if (search)
      where.push({
        [Op.or]: [
          { nome: { [Op.like]: '%' + search + '%' } },
          { nome_mae: { [Op.like]: '%' + search + '%' } },
          { registro_hc: { [Op.like]: '%' + search + '%' } },
        ],
      })

    if (request.query.ativos)
      where.push({ ativo: true })

    const qtdPacientes = await Paciente.count({where});
    const { paginas, ...SortPaginateOptions } = SortPaginate(request.query, atributos, qtdPacientes);

    await Paciente.findAndCountAll({
      ...SortPaginateOptions,
      where,
      include: {
        association: Paciente.associations.uconsulta,
        order: [['dt_inicio', 'DESC']],
      },
      group: ['paciente.id'],
    })
      .then((pacientes) => {
        response.status(200).json({ 'dados': pacientes.rows, 'registros': qtdPacientes, 'paginas': paginas });
      })
  };


  async get(request, response) {
    const result = await Paciente.findOne({
      where: {
        id: request.params.id
      },
      include: [{
          model: Consulta,
          as: "uconsulta"
        },{
          model: PacienteHepB,
          as: "hepatiteb",
          include: [{
            model: Tratamento,
            as: "tratamento"
          }],
          nested: true
        },{
          model: PacienteHepC,
          as: "hepatitec",
          include: [{
            model: Tratamento,
            as: "tratamento"
          }],
          nested: true
        }
      ]
      /*include: {
        all: true,
        nested: true
      }*/
    });
    if (result) response.status(200).json(result);
    else
      throw new AppError("Paciente não encontrado!!", 422, [
        "Não existe paciente com este 'id'!"
      ]);
  }

  async update(request, response) {
    const scheme = pacienteUpdateScheme;

    // Validando com o esquema criado:
    try {
      await scheme.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (error) {
      throw new AppError(error.name, 422, error.errors);
    }

    if (request.body.registro_hc) {
      //procura um registro_hc testar se é único
      if (
        request.body.registro_hc && await Paciente.findOne({
          where: {
            registro_hc: request.body.registro_hc,
            id: {
              [Op.ne]: request.params.id
            }
          }
        })
      ) {
        throw new AppError("ValidationError", 422, ["O registro_hc já existe!"]);
      }
    }

    if (request.body.peso) {
      request.body.peso_atualizacao = new Date().toISOString().replace('T', ' ').substr(0, 19)
    }

    const { id } = request.params;
    const { hepatiteb, hepatitec, ...requestBody } = request.body;


    const paciente = await Paciente.findOne({
      where: { id }
    });
    if (paciente) {
      await paciente.update({
        ...requestBody
      })
      if (hepatiteb) {
        // se o hepatiteb já exsitir para esse paciente, apenas atualiza, se não cria um
        const pacienteHepatiteB = await PacienteHepB.findOne({
          where: { paciente_id: id }
        })
        if (pacienteHepatiteB) {
          await pacienteHepatiteB.update({
            ...hepatiteb
          })
        }
        else {
          // Revalida dados, pois para criação há atributos obrigatórios
          try {
            await hepatiteRequiredScheme.validate(hepatiteb, { abortEarly: false }); // AbortEarly para fazer todas as validações
          } catch (err) {
            throw new AppError(err.name, 422, err.errors);
          }
          await PacienteHepB.create({
            ...hepatiteb,
            paciente_id: paciente.id
          })
        }
      }
      if (hepatitec) {
        // percorre todo vetor de hepatitec, criando ou atualizando os dados
        const registrosHepC = await PacienteHepC.findAll({
          where: {
            paciente_id: id
          }
        })
        // aqui serão armazenadas os hepc atualizados, para excluir os outros que não foram listados
        const registrosIdsAtualizadosHepC = [];

        await Promise.all(
          hepatitec.map(async (hepc) => {
            const alreadyExists = registrosHepC.some(registroHC => hepc.id == registroHC.id)
            // se o hepatitec já exsitir para esse paciente, apenas atualiza, se não cria um

            if (alreadyExists) {
              registrosIdsAtualizadosHepC.push(hepc.id)
              await PacienteHepC.update({
                ...hepc
              }, {
                where: { id: hepc.id ?? 0 }
              })
            }
            else {

              // Revalida dados, pois para criação há atributos obrigatórios
              try {
                await hepatiteRequiredScheme.validate(hepc, { abortEarly: false }); // AbortEarly para fazer todas as validações
              } catch (err) {
                throw new AppError(err.name, 422, err.errors);
              }
              await PacienteHepC.create({
                ...hepc,
                paciente_id: paciente.id
              })
            }

          })
        )

        // para todo registro que havia inicialmente e que não foi atualizado, este será apagado
        await Promise.all(
          registrosHepC.map(async (hepc) => {
            if (!registrosIdsAtualizadosHepC.some(registrohc => hepc.id == registrohc))
              await PacienteHepC.destroy({
                where: { id: hepc.id }
              })
          })
        )

      }
      return response.status(201).json({
        mensagem: "Paciente atualizado com sucesso!"
      });
    }
    else {
      throw new AppError("Paciente não encontrado!", 404, ["'id' do paciente não encontrado!"]);
    }

  }

  async deepSearch(request, response) {
    const validationSchema = yup.object().shape({
      campos: yup.array()
        .of(
          yup.object().shape({
            campo: yup.string().required(),
            comparador: yup.mixed().oneOf(['MAIOR', 'MENOR', 'IGUAL', 'COMECA', 'TERMINA', 'CONTEM', 'EXISTE', 'NAOEXISTE']).required(),
            valor: yup.string().nullable(),
          })
        )
        .required('Campos obrigatorios'),
      operador: yup.mixed().oneOf(['AND', 'OR']).required(),
    })

    // Validando com o esquema criado:
    try {
      await validationSchema.validate(request.body, { abortEarly: false }); // AbortEarly para fazer todas as validações
    } catch (err) {
      throw new AppError(err.name, 422, err.errors);
    }

    const pacienteService = new PacienteService();
    const paciente = await pacienteService.deepSearch(request.body.campos, request.body.operador, request.query.pagina);
    return response.status(200).json(paciente)
  }

}

module.exports = PacienteController;
