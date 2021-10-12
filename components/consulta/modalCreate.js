export default {
  name: 'modalCreate',
  props: ['value'],
  data() {
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dataConsulta: '',
      pacienteId: '',
      pacientes: [{nome: '', id: 0}],
      medico: '',

      consulta:{
        paciente_id:'',
        status:'AGUARDANDOC',
        descricao:'',
        //usuario_id_medico:'',
        dt_inicio:''
      },

      menuDataConsulta: false,
      toast: false,
      toastMensagem: '',

    }
  },
  watch: {
      'consulta.paciente_id': function (val){
      this.verificaPrimeraConsulta(val);
    }
  },
  mounted() {
    this.listaPacientes();
  },
  methods: {
    marcaConsulta(data) {

      var aux = this.dataConsulta.split("-")

      var jsDate = new Date(aux[0], aux[1] - 1, aux[2], '00', '00', '00', '00');
      console.log(this.dataConsulta);
      console.log(jsDate);

      let consulta = JSON.parse(JSON.stringify(this.consulta))
      consulta.dt_inicio = jsDate;

      this.$axios.$post('/consulta', consulta).then(response => {
        this.pacientes = response.dados;
        this.abreToast("Consulta agendada com sucesso!");
      }).catch(error => {
        console.log(error);
      })

      this.listaPacientes();

    },
    verificaPrimeraConsulta(pacienteId){
      //query verificar se é a primeira consulta
      console.log(pacienteId);
      this.abreToast('Primeira consulta desse paciente!');
    },

    listaPacientes(){
      this.$axios.$get('/paciente').then(response =>{
        this.pacientes = response.dados;
      }).catch(error =>{
        console.log(error);
      })
    },

  abreToast(mensagem) {
    this.toastMensagem = mensagem;
    this.toast = true;
  },

  }
}
