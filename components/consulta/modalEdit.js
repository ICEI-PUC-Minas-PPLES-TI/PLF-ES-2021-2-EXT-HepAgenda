export default {
  name: 'modalEdit',
  props: ['value','data'],
  data() {
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dataConsulta: '01/01/1111',
      paciente: {
        nome: 'João Silva',
        data_nascimento: '11/11/1111 - 55 Anos',
        nome_mae: 'Neide Braulia',
        registro_hc: 'XXXXX XX',
      },
      historico: [
        {
          id: 1,
          mensagem: 'Usuario x1 alterou o status do atendimento para aguardando consulta',
          data: '01/01/11 11:11'
        },
        {
          id: 2,
          mensagem: 'Usuario x2 alterou o status do atendimento para aguardando consulta',
          data: '01/01/11 11:12'
        },
        {
          id: 3,
          mensagem: 'Usuario x3 alterou o status do atendimento para aguardando consulta',
          data: '01/01/11 11:13'
        },
        {
          id: 4,
          mensagem: 'Usuario x4 alterou o status do atendimento para aguardando consulta',
          data: '01/01/11 11:14'
        },
        {
          id: 5,
          mensagem: 'Usuario x4 alterou o status do atendimento para aguardando consulta',
          data: '01/01/11 11:15'
        },
      ],
      descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at dignissim orci. Mauris aliquet est diam, ac tincidunt ipsum tristique a.Cras ut pretium metus',
      statusAtual: 'Aguardando Consulta',
      status: ['Em confirmação', 'Aguardando Consulta'],
      medicos: ['Não definido'],
      medicoAtual: 'Não definido',
      menuDataConsulta: false,
      modalConfirm: false,

    }
  },
  mounted() {
    //this.listaPacientes();
  },
  watch:{
    data(newVal, oldVal){
      if(newVal.paciente)
        this.paciente = newVal.paciente
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    editConsulta() {

    }

  }
}
