<template>
  <div class="text-center">
    <v-dialog
      v-model="value"
      scrollable
      max-width="500px"
      transition="dialog-bottom-transition"
      class="tratamento-modal"
      @click:outside="$emit('input', false)"
      @keydown.esc="$emit('input', false)"
    >
      <v-card>
        <v-card-title class="text-h5 tratamento-modal-title">
          <h4>
            <span> {{titulo}} </span>
          </h4>
          <v-btn icon @click="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-form ref="formTratamento" v-model="valid" lazy-validation>
              <!-- Identificação -->
              <v-row>
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-text-field
                    v-model="tratamento.identificacao"
                    hide-details="auto"
                    label="Identificação"
                    :rules="[v => !!v || 'Identificação é obrigatório']" 
                    maxlength="30"
                    outlined
                  />
                </v-col>
              </v-row>

              <!-- select de direcionado -->
              <v-row class="mt-n2">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-select
                    v-model="tratamento.direcionado"
                    :clearable="true"
                    hide-details="auto"
                    label="Direcionamento"
                    :rules="[(v) => !!v || 'Direcionado obrigatório']"
                    :items="direcionamentos"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                </v-col>
              </v-row>

              <!-- Botão de marcarConsulta -->
              <v-row>
                <v-col class="tratamento-modal-marcar text-center">
                  <v-btn color="primary" block x-large @click="gravar">
                    Gravar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="toast" shaped>
      {{ toastMensagem }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="toast = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "modal-tratamento",
  props: ["value", "tratamentoId"],
  data() {
    return {
      valid: true,
      titulo: "Novo tratamento",

      tratamento: {
        id:'',
        identificacao: '',
        direcionado: ''
      },

      direcionamentos:[
        {label: "Hepatite B", value: "HEPB"}, 
        {label: "Hepatite C", value: "HEPC"},
        {label: "Outro", value: "OUTRO"}
      ],

      toast: false,
      toastMensagem: "",
    };
  },
  watch: {
    tratamentoId: function (id) {
      if(id != 0){
      this.edit(id);
      this.titulo = "Editar tratamento"
      }else{
        this.titulo = "Novo tratamento"
        this.limpaDados();
      }
    },
  },
  methods: {
    gravar() {
      if (this.$refs.formTratamento.validate()) {
        let tratamento = JSON.parse(JSON.stringify(this.tratamento));

        if( tratamento.id == 0 ){
          this.$axios
              .$post("/tratamento", tratamento)
              .then((response) => {
                this.limpaDados();
                this.abreToast("Tratamento adicionado com sucesso!");
              })
              .catch((error) => {
                this.abreToast(error.message);
              });
        }else{
            this.$axios
              .$put("/tratamento/" + tratamento.id, tratamento)
              .then((response) => {
                this.edit(tratamento.id);
                this.abreToast("Tratamento atualizado com sucesso!");
              })
              .catch((error) => {
                this.abreToast(error.message);
              });
        }
        this.$emit('input', false)                
      }
    },

    edit(id){
      this.$axios
        .$get("/tratamento/" + id)
        .then((response) => {
          this.tratamento = response;
        })
        .catch((error) => {
          console.log(error);
        });

    },

    abreToast(mensagem) {
      this.toastMensagem = mensagem;
      this.toast = true;
    },
    limpaDados() {
      this.tratamento = {
        id: "",
        identificacao: "",
        direcionado: "",
      }
      this.$refs.formTratamento.reset();
    },

  },
};
</script>

<style>
.tratamento-modal-title {
  margin-left: 20px;
}

.tratamento-modal-title h4 {
  width: calc(100% - 50px);
  text-align: left;
  border-bottom: 1px solid #b7b7b7;
  line-height: 0.1em;
  margin: 20px 0 20px;
}

.tratamento-modal-title h4 span {
  background: #fff;
  padding: 0 5px;
}

.tratamento-modal-marcar {
  border-radius: 10px;
  background: #fff;
}
</style>
