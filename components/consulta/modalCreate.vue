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
                    v-if="!paciente"
                    v-model="consulta.paciente_id"
                    :items="pacientes"
                    hide-details="auto"
                    :clearable="true"
                    label="Paciente (Obrigatório)"
                    :filter="customFilterPaciente"
                    :search-input="procuraPacienteTxt"
                    @update:search-input="procuraPaciente"
                    item-text="nome"
                    item-value="id"
                    :rules="[(v) => !!v || 'Paciente obrigatório']"
                    outlined
                  >
                  <template v-slot:item="data">
                    <div style="white-space: nowrap;border-bottom: 1px solid #eee;width:100%" class="d-block">
                      <b class="d-block">{{ data.item.nome }}</b>
                      <small class="d-block">Reg. HC: {{ data.item.registro_hc }}</small>
                      <small class="d-block">Mãe: {{ data.item.nome_mae }}</small>
                    </div>
                  </template>
                  </v-autocomplete>
                  <v-text-field v-else hide-details="auto" label="Paciente (Obrigatório)" outlined disabled :value="paciente.nome" />
                </v-col>
              </v-row>
              <!-- Data da consulta -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-menu
                    v-model="menuData"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    class="paciente-modal-input-date"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="consulta.dt_inicio"
                        outlined
                        hide-details="auto"
                        :rules="[(v) => !!v || 'Data da consulta obrigatória']"
                        label="Data da consulta (Obrigatório)"
                        type="date"
                        min="2017-06-01"
                        max="2050-06-30"
                        class="paciente-modal-input-date"
                      >
                        <span slot="append">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-calendar
                          </v-icon>
                        </span>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="consulta.dt_inicio"
                      :allowed-dates="datasPermitidas"
                      @input="menuData = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <!-- select de médico -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-autocomplete
                    v-model="consulta.usuario_id_medico"
                    :items="medicos"
                    hide-details="auto"
                    :clearable="true"
                    label="Medico"
                    item-text="nome"
                    item-value="id"
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
                    label="Descrição"
                    :rules="[(v) => (v || '' ).length <= 60 || 'Maximo de 60 caracteres']"
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
  props: ["value", 'paciente','bloqueioSemana'],
  data() {
    return {
      valid: true,

      pacientes: [{ nome: "", id: 0 }],
      medicos: [{ nome: "", id: 0 }],

      consulta: {
        paciente_id: "",
        status: "AGUARDANDOC",
        descricao: "",
        usuario_id_medico:null,
        dt_inicio: null,
      },

      toast: false,
      toastMensagem: "",
      menuData: false,
      procuraPacienteTxt: null
    };
  },
  watch: {
    value: function (val) {
      this.listaPacientes();
      this.listaMedicos();
    },
    "consulta.paciente_id": function (val) {
      this.verificaPrimeraConsulta(val);
    }
  },
  mounted() {
    if(this.paciente) {
      this.pacientes = [this.paciente]
      this.consulta.paciente_id = this.paciente.id
    } else
      this.listaPacientes();
    this.listaMedicos();
  },
  methods: {

    marcaConsulta() {
      if (this.$refs.formConsulta.validate()) {

        let consulta = JSON.parse(JSON.stringify(this.consulta));
        consulta.dt_inicio = this.consulta.dt_inicio.replaceAll('-', '/');

        this.$axios
          .$post("/consulta", consulta)
          .then((response) => {
            this.limpaDados();
            this.$Message.alert('Consulta agendada com sucesso!',null, {type: 'success', msgBody: {style: {width: '30%'}}})
            this.$emit('criado')
          })
          .catch((error) => {
            console.log(error.response)
            this.$Message.alert(error.response.data.message,'Erro', {type: 'error', msgBody: {style: {width: '30%'}}})
          });
      }
    },
    verificaPrimeraConsulta(pacienteId) {
      //query verificar se é a primeira consulta
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
    listaPacientes(limit = 20, search = null) {
      if(!this.paciente)
        this.$axios
          .$get(`/paciente?limite=${limit}&pesquisar=${search ? search: ''}&ativos=1`)
          .then((response) => {
            this.pacientes = response.dados;
          })
          .catch((error) => {
            console.log(error);
          });
    },

    listaMedicos(){
      this.$axios
        .$get(`/usuario?medico=true&ativos=1`)
        .then((response) => {
          this.medicos = response.dados;
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
        usuario_id_medico:'',
        dt_inicio: null,
      }
      this.$refs.formConsulta.reset();
      this.$emit('input', false)
    },
    procuraPaciente(val){
      if(val && val.length >= 3) {
        this.procuraPacienteTxt = val
        this.listaPacientes(10, val)
      } else if(val == null)
        this.listaPacientes()
    },
    customFilterPaciente(item, queryText){
      const textOne = item.nome?.toLowerCase()
      const textTwo = item.nome_mae?.toLowerCase()
      const textThree = item.registro_hc?.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne?.indexOf(searchText) > -1 || textTwo?.indexOf(searchText) > -1 || textThree?.indexOf(searchText) > -1
    },
    datasPermitidas(val){
      const dt = new Date(val + ' 23:59:59')
      if(!(dt >= new Date()))
        return false
      
      if(this.bloqueioSemana) {
        const diaSemana = dt.getDay()
        if(this.bloqueioSemana[diaSemana].ativo)
          return false;
      }

      return true
        
    }
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
