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
      tabelaPaginaAtual: 1,
      tabelaPaginas: 1,
      totalItems: 1,
      tabelaCarregando: false,
    }
  },
  mounted(){
    this.listaUsuarios();
  },
  methods: {

    listaUsuarios() {
      this.tabelaCarregando = true
      this.$axios.$get(`/usuario?pagina=${this.tabelaPaginaAtual}`).then(response => {
        this.usuarios = response.dados;
        this.tabelaPaginas = response.paginas
        this.totalItems = response.total
      }).catch(error => {
        console.log(error)
        this.errored = true
      }).finally(() => {
        this.tabelaCarregando = false
      });
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
