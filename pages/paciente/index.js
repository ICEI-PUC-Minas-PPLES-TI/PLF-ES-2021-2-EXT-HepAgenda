import modalPaciente from '@/components/paciente/modal.vue'

export default {
  layout: 'main',
  components: {
    modalPaciente
  },
  data() {
    return {
      headers: [
        { text: 'PACIENTE', value: 'nome' },
        { text: 'MÃE', value: 'nome_mae' },
        { text: 'NASCIMENTO', value: 'data_nascimento' },
        { text: 'ÚLTIMA CONSULTA', value: 'ultima_consulta' },
        { text: 'AÇÕES', value: 'actions', sortable: false },
      ],
      pacientes: [
        {
          id: '',
          nome: "",
          data_nascimento: '',
          ultima_consulta: "Pendente no back",
          nome_mae: "",

        }
      ],

      pacienteId: 0,
      teste: '',
      modalAtivo: false
    }
  },
  mounted() {
    this.listaPacientes();
  },
  methods: {

    listaPacientes() {
      this.$axios.$get('/paciente').then(response => {
        this.pacientes = response.dados;
        console.log(this.pacientes);
      }).catch(error => {
        console.log(error)
        this.errored = true
      })
    },

    formataTipo(tipo) {
      if (tipo == "A") {
        return "Administrador"
      } else if (tipo == "M") {
        return "Médico"
      } else if (tipo == "V") {
        return "Visualizador"
      }
    }
,
    abreModal(id) {

      this.pacienteId = id;

      this.modalAtivo = !this.modalAtivo;

    },

  }

}
