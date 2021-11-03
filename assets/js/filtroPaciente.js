const attributes = [
  {
    label: 'Nome',
    field: 'nome',
    type: 'text'
  }, {
    label: 'Registro HC',
    field: 'registro_hc',
    type: 'text'
  }, {
    label: 'Nome da Mãe',
    field: 'nome_mae',
    type: 'text'
  }, {
    label: 'Telefone',
    field: 'telefone',
    type: 'text'
  }, {
    label: 'E-mail',
    field: 'email',
    type: 'text'
  }, {
    label: 'Altura',
    field: 'altura',
    type: 'number'
  }, {
    label: 'Peso',
    field: 'peso',
    type: 'number'
  }, {
    label: 'Idade',
    field: 'idade',
    type: 'number'
  }, {
    label: 'Data de Nascimento',
    field: 'data_nascimento',
    type: 'date'
  }, {
    label: 'Comorbidade',
    field: 'comorbidade',
    type: 'enum',
    values: [
      'HEPB',
      'HEPC',
      'OUTRO',
    ]
  }, {
    label: 'Sexo',
    field: 'sexo',
    type: 'enum',
    values: [
      'M',
      'F'
    ]
  }
]

export default attributes