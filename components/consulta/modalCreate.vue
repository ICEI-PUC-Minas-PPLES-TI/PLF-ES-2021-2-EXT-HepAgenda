<template>
  <div class="text-center">
    <v-dialog
      v-model="value"
      scrollable
      max-width="500px"
      transition="dialog-bottom-transition"
      class="consulta-modal"
      @click:outside="$emit('input', false)"
      @keydown.esc="$emit('input', false)"
    >
      <v-card>
        <v-card-title class="text-h5 consulta-modal-title">
          <h4>
            <span> Nova Consulta </span>
          </h4>
          <v-btn icon @click="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-form ref="formConsulta" v-model="valid" lazy-validation>
              <!-- select pacientes -->
              <v-row class="mt-n5">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-autocomplete
                    v-model="consulta.paciente_id"
                    :items="pacientes"
                    hide-details="auto"
                    :clearable="true"
                    label="Paciente"
                    :item-text="
                      (item) => item.nome + ' - ' + item.data_nascimento
                    "
                    item-value="id"
                    :rules="[(v) => !!v || 'Paciente obrigatório']"
                    outlined
                  />
                </v-col>
              </v-row>
              <!-- Data da consulta -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-text-field
                        v-model="consulta.dt_inicio"
                        outlined
                        hide-details="auto"
                        :rules="[(v) => !!v || 'Data da consulta obrigatória']"
                        label="Data da consulta"
                        type="datetime-local"
                        min="2017-06-01T08:30"
                        max="2050-06-30T16:30"
                        class="paciente-modal-input-date"
                      >
                      </v-text-field>
                </v-col>
              </v-row>
              <!-- select de médico -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-select
                    v-model="consulta.usuario_id_medico"
                    :clearable="true"
                    hide-details="auto"
                    label="Médico (Opcional)"
                    item-text="label"
                    item-value="value"
                    outlined
                  />
                </v-col>
              </v-row>
              <!-- Descrição -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-textarea
                    v-model="consulta.descricao"
                    hide-details="auto"
                    outlined
                    label="Descrição (Opcional)"
                    :rules="(v) =>(v && v.length <= 60) || 'Maximo de 60 caracteres'"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
              <!-- Botão de marcarConsulta -->
              <v-row class="mt-n2">
                <v-col class="consulta-modal-marcar text-center">
                  <v-btn color="primary" block x-large @click="marcaConsulta">
                    Marcar Consulta
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
  name: "modalCreate",
  props: ["value"],
  data() {
    return {
      valid: true,

      pacientes: [{ nome: "", id: 0 }],
      medicos: [{ nome: "", id: 0 }],

      consulta: {
        paciente_id: "",
        status: "AGUARDANDOC",
        descricao: "",
        //usuario_id_medico:'',
        dt_inicio: "",
      },

      toast: false,
      toastMensagem: "",
    };
  },
  watch: {
    value: function (val) {
      this.listaPacientes();
    },
    "consulta.paciente_id": function (val) {
      this.verificaPrimeraConsulta(val);
    },
  },
  mounted() {
    this.listaPacientes();
  },
  methods: {
    marcaConsulta() {
      if (this.$refs.formConsulta.validate()) {
        this.consulta.dt_inicio = new Date(this.consulta.dt_inicio);

        let consulta = JSON.parse(JSON.stringify(this.consulta));

        this.$axios
          .$post("/consulta", consulta)
          .then((response) => {
            this.limpaDados();
            this.abreToast("Consulta agendada com sucesso!");
          })
          .catch((error) => {
            this.abreToast(error.message);
          });
      }
    },
    verificaPrimeraConsulta(pacienteId) {
      //query verificar se é a primeira consulta
      console.log(pacienteId);
      if (pacienteId) {
        let paciente = JSON.parse(JSON.stringify({ paciente_id: pacienteId }));
        this.$axios
          .$post("/primeiraconsulta", paciente)
          .then((response) => {
            if (response.primeiraConsulta) {
              this.abreToast("Primeira consulta desse paciente!");
            }
          })
          .catch((error) => {
            this.abreToast(error.message);
          });
      }
    },

    listaPacientes() {
      this.$axios
        .$get("/paciente")
        .then((response) => {
          this.pacientes = response.dados;
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
      this .consulta = {
        paciente_id: "",
        status: "AGUARDANDOC",
        descricao: "",
        //usuario_id_medico:'',
        dt_inicio: "",
      }
      this.$refs.formConsulta.reset();
    },
  },
};
</script>

<style>
.consulta-modal-title {
  margin-left: 40px;
}

.consulta-modal-title h4 {
  width: calc(100% - 27px);
  text-align: left;
  border-bottom: 1px solid #b7b7b7;
  line-height: 0.1em;
  margin: 20px 0 20px;
}

.consulta-modal-title h4 span {
  background: #fff;
  padding: 0 10px;
}

.consulta-modal-marcar {
  border-radius: 10px;
  background: #fff;
}
</style>
