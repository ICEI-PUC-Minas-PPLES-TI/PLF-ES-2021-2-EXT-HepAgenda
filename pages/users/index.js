
 export default {
  layout: 'main',
  components: {
 //   modalEditUsuario
  },

  data() {
    return {
      show1: false,
      show2: false,
      dialog: false,
      formData: {
        nome: null,
        //email: null,
        senha: null,
        //confirmar_senha: null,
        tipo: " "
      },
      rules: {
        required: value => !!value || "Obrigatório!",
        min: v => {
          if (
            v &&
            v.length >= 8 &&
            /\d/.test(v) &&
            /[a-z]/g.test(v) &&
            /[A-Z]/g.test(v)
          )
            return true;
          else
            return "Min 8 caracteres, 1 número, 1 letra minúscula, 1 letra maiúscula e um caracter especial!";
        },
        equal: v => v === this.formData.senha || "Senhas não conferem"
  },

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

    editItem(item){
      console.log(item)
      //pegar cada item do formData
      this.formData.nome=item.nome
      this.formData.tipo=item.tipo
      this.formData.id=item.id

      this.dialog = true
    },

    listaUsuarios() {
      this.$axios.$get('/usuario').then(response => {
        this.usuarios = response.dados;
        console.log(this.usuarios);
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
    },

    limparDados() {
      this.formData = {
        nome: null,
        //email: null,
        senha: null,
        //confirmar_senha: null,
        tipo: " "
      }
    },

    atualizarUsuario() {
      console.log("Botao Salvar apertado");
      this.$axios
        .put('/usuario/' + this.formData.id, this.formData)
        .then(res => {
          this.limparDados();
          this.dialog = false;
          alert("Usuario Atualizado!");
        })
        .catch(err => {
          alert(JSON.stringify(err.response.data));
          console.log(err.response.data);
        });
    }

  }

}
