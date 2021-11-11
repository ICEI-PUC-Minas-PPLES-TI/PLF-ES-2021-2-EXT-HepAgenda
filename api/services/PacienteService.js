const AppError = require("../errors/AppError");
const Paciente = require("../models/Paciente");
const { Op, Sequelize } = require('sequelize')

class PacienteService {
  async getById(id, atributos) {
    const paciente = await Paciente.findOne({
      where: {
        id: id
      },
      attributes: atributos
    });
    return paciente;
  }

  async deepSearch(campos, operador, pagina = 1){
    const camposValidos = {
      'nome': {tipo: 'STRING'},
      'registro_hc': {tipo: 'STRING'},
      'nome_mae': {tipo: 'STRING'},
      'email': {tipo: 'STRING'},
      'telefone': {tipo: 'STRING'},
      'peso': {tipo: 'NUMBER'},
      'altura': {tipo: 'NUMBER'},
      'data_nascimento': {tipo: 'DATE'},
      'sexo': {tipo: 'ENUM', opcoes: ['M','F',null]},
      'comorbidade': {tipo: 'ENUM', opcoes: ['HEPB','HEPC','OUTRO',null]},
      'idade': {tipo: 'NUMBER', custom: true},
    }
    const comparacoesValidas = {
      'STRING': ['IGUAL','COMECA','TERMINA','CONTEM','EXISTE','NAOEXISTE'],
      'NUMBER': ['IGUAL','MAIOR','MENOR','EXISTE','NAOEXISTE'],
      'DATE': ['IGUAL','MAIOR','MENOR','EXISTE','NAOEXISTE'],
      'ENUM': ['IGUAL','EXISTE','NAOEXISTE'],
    }
    let symb;
    if(operador == 'AND')
      symb = Op.and
    else
      symb = Op.or
    let whre = {
      [symb]: [], 
    }
    
    // Preparar filtros
    campos.forEach(function (campo, index) {
      const tipo = camposValidos[campo['campo']]?.tipo
      if(!tipo) // Caso tente pesquisar um campo que não existe
        throw new AppError(`Campo ${campo['campo']} nao existe`, 405)
      else if(tipo == 'DATE' && !/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(campo['valor'])) // Se campo data, validar formato yyyy-mm-dd
        throw new AppError(`Data ${campo['campo']} com formato invalido (Deve ser yyyy-mm-dd)`, 405)
      else if(tipo == 'ENUM' && camposValidos[campo['campo']].opcoes.indexOf(campo['valor']) == -1 ) // Verificar caso enum se veio um valor do enum válido
        throw new AppError(`Campo ${campo['campo']} opcao invalida. Opcoes: ${camposValidos[campo['campo']].opcoes.join()}`, 405)
      
      if(comparacoesValidas[tipo].indexOf(campo['comparador']) == -1)
        throw new AppError(`Comparador do ${campo['campo']} nao pode ser usado, utilize ${comparacoesValidas[tipo].join(' ou ')}`, 405)

      if(tipo == 'DATE')
        campo['valor'] = Sequelize.literal(`'${campo['valor']}'`) // Por algum motivo o sequelize não funciona o = no DATE aí tem esse trem

      let comp = null
      let compString = null
      switch (campo['comparador']) {
        case 'IGUAL':
          comp = Op.eq
          compString = ' = ' // Para uso em idade
          break;
        case 'COMECA':
          comp = Op.startsWith
          break;
        case 'TERMINA':
          comp = Op.endsWith
          break;
        case 'CONTEM':
          comp = Op.substring
          break;
        case 'MAIOR':
          comp = Op.gt
          compString = ' > ' // Para uso em idade
          break;
        case 'MENOR':
          comp = Op.lt
          compString = ' < ' // Para uso em idade
          break;
        case 'EXISTE':
          comp = Op.not
          campo['valor'] = null
          compString = ' IS NOT NULL' // Para uso em idade
          break;
        case 'NAOEXISTE':
          comp = Op.is
          campo['valor'] = null
          compString = ' IS NULL' // Para uso em idade
          break;
      }

      if(camposValidos[campo['campo']]?.custom){
        if(campo['campo'] == 'idade' && (/^\d+$/.test(campo['valor']) || !campo['valor'])) // Verificar se é numero ou nulo (Evitar caracteres improprias)
          whre[symb].push(Sequelize.literal("TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) " + compString + (campo['valor'] ? campo['valor']: '') ))
      } else {
        whre[symb].push({
          [campo['campo']]: { [comp]: campo['valor'] }
        })
      }

    });

    // Pesquisar no banco
    let res;
    const limit = 30
    await Paciente.findAndCountAll({
      include: {
        association: Paciente.associations.uconsulta,
        order: [['dt_inicio', 'DESC']],
      },
      group: ['Paciente.id'],
      where: whre,
      limit: limit,
      offset: 0 + ((pagina - 1) * limit)
    })
    .then((dados) => {
      res= {'dados': dados.rows, 'registros': dados.count.length, 'paginas': Math.ceil(dados.count.length/limit) }
      
    }).catch( err => {
      console.log(err)
      throw new AppError(`Erro interno do servidor`, 500)
    });
    return res;
  }
}

module.exports = PacienteService;
