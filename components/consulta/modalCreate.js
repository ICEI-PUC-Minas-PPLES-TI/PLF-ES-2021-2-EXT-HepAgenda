export default {
  name: 'modalCreate',
  props: ['value'],
  data() {
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dataConsulta: '',
      pacienteId: '',
      pacientes: [{nome: 'joao', id: 1}, {nome: 'pedro', id: 2}],
      medico: '',
      descricao: '',
      menuDataConsulta: false,

      toast: false,
      toastMensagem: 'Primeira consulta desse paciente!',

    }
  },
  watch: {
    pacienteId: function (val){
      this.verificaPrimeraConsulta(val);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    marcaConsulta(data) {

    },
    verificaPrimeraConsulta(pacienteId){
      //query verificar se é a primeira consulta
      this.toast = true;
    }

  }
}
