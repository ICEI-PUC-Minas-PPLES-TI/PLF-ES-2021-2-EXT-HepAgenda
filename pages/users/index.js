export default {
  layout: 'main',

  data() {
    return {
      headers: [
        { text: 'NOME DO USUÁRIO', value: 'nome' },
        { text: 'LOGIN', value: 'email' },
        { text: 'TIPO', value: 'tipo' },
        { text: 'AÇÕES', value: 'actions', sortable: false },
      ],
      usuarios: [
        {
          nome: '',
          email: '',
          tipo: '',
        }
      ],
      teste: '',
    }
  },
  mounted(){
    this.listaUsuarios();
  },
  methods: {

    listaUsuarios() {
      this.$axios.$get('/usuario').then(response => {
        this.usuarios = response.dados;
      }).catch(error => {
        console.log(error)
        this.errored = true
      })
    },

    formataTipo(tipo){
      if(tipo == "A"){
        return "Administrador"
      }else if(tipo == "M"){
        return "Médico"
      }else if(tipo == "V"){
        return "Visualizador"
      }
    }

  }

}
