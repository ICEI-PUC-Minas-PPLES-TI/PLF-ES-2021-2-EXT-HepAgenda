<template>
  <div class="text-center">
    <v-dialog
      v-model="value"
      scrollable
      max-width="1400px"
      transition="dialog-bottom-transition"
      class="consulta-modal"
      @click:outside="$emit('input', false)"
      @keydown.esc="$emit('input', false)"
    >
      <v-card>
        <v-card-title class="text-h5 consulta-modal-title">
          <h4>
            <span> Consulta #1 </span>
          </h4>

          <v-btn icon @click="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid id="input-usage">
            <v-form ref="formConsulta" v-model="valid" lazy-validation>
              <!-- paciente -->
              <v-row no-gutters>
                <v-col :md="8" :sm="12" :xl="8" cols="12">
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-input
                        :messages="consulta.paciente.nome"
                        label="Paciente"
                      >
                      </v-input>
                    </v-col>
                  </v-row>
                  <!-- Data da consulta -->
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-input
                        :messages="consulta.dt_inicio"
                        label="Data da consulta"
                      ></v-input>
                    </v-col>
                  </v-row>
                  <!-- Descrição -->
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <label for=""> Descrição do agendamento </label>
                      <v-textarea
                        readonly
                        flat
                        solo
                        row-height="10"
                        hide-details="auto"
                        auto-grow
                        v-model="consulta.descricao"
                        label="Descrição do agendamento"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <!-- Status -->
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-select
                        v-model="consulta.status"
                        :items="status"
                        :rules="[(v) => !!v || 'Status é obrigatório']"
                        item-value="status"
                        item-text="nome"
                        hide-details="auto"
                        menu-props="auto"
                        label="Status"
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <!-- Medico -->
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-select
                        v-model="medicoAtual"
                        hide-details="auto"
                        :items="medicos"
                        menu-props="auto"
                        label="Médico"
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <!-- Relatório do atendimento -->
                  <v-row class="mx-auto">
                    <v-col :md="12" :sm="12" :xl="12" cols="12">
                      <v-textarea
                        outlined
                        hide-details="auto"
                        label="Relatório do atendimento"
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- Linha vertical -->
                <v-col :md="4" :sm="12" :xl="4" cols="12" class="mt-1">
                  <div class="vertical-line">
                    <!-- Icone -->
                    <v-row>
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <div class="text-center">
                          <svg
                            width="70"
                            height="70"
                            viewBox="0 0 27 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.25788 26C2.25309 25.9998 2.24166 25.9994 2.22457 25.9981C2.18963 25.9957 2.13319 25.9902 2.06284 25.9785C1.91739 25.9542 1.73875 25.9076 1.57221 25.8243C1.40959 25.743 1.27739 25.6368 1.18361 25.4961C1.09401 25.3617 1 25.1375 1 24.75C1 23.8818 1.46304 21.8887 3.23836 20.1134C4.98436 18.3673 8.08589 16.75 13.5 16.75C18.9141 16.75 22.0156 18.3673 23.7616 20.1134C25.537 21.8887 26 23.8818 26 24.75C26 25.1375 25.906 25.3617 25.8164 25.4961C25.7226 25.6368 25.5904 25.743 25.4278 25.8243C25.2613 25.9076 25.0826 25.9542 24.9372 25.9785C24.8668 25.9902 24.8104 25.9957 24.7754 25.9981C24.7583 25.9994 24.7469 25.9998 24.7421 26H2.25788ZM17.5659 10.8159C16.4875 11.8942 15.025 12.5 13.5 12.5C11.975 12.5 10.5125 11.8942 9.43414 10.8159C8.3558 9.73753 7.75 8.27499 7.75 6.75C7.75 5.22501 8.3558 3.76247 9.43414 2.68414C10.5125 1.6058 11.975 1 13.5 1C15.025 1 16.4875 1.6058 17.5659 2.68414C18.6442 3.76247 19.25 5.22501 19.25 6.75C19.25 8.27499 18.6442 9.73753 17.5659 10.8159Z"
                              stroke="black"
                              stroke-width="1"
                            />
                          </svg>
                        </div>
                      </v-col>
                    </v-row>
                    <!-- Np,e -->
                    <v-row class="mt-n8">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-input
                          :messages="consulta.paciente.nome"
                          label="Nome"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- Data Nascimento -->
                    <v-row class="mt-n3">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-input
                          :messages="consulta.paciente.data_nascimento"
                          label="Data de Nascimento"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- Mae -->
                    <v-row class="mt-n3">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-input
                          :messages="consulta.paciente.nome_mae"
                          label="Nome da Mãe"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- Registro HC -->
                    <v-row class="mt-n3">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-input
                          :messages="consulta.paciente.registro_hc"
                          label="Registro HC"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- Barra horizontal -->
                    <v-row class="mt-n8">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <div class="historico-divider"></div>
                        <v-input
                          class="mt-n3"
                          label="Histórico da Consulta"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- historico -->
                    <v-row class="mt-n9">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <div
                          class="card-historico"
                          v-for="(item, index) in consulta.logs"
                          v-bind:item="item"
                          v-bind:index="index"
                          v-bind:key="item.id"
                        >
                          {{ item.descricao }}
                          <div class="card-historico-data text-right">
                            {{ item.data }}
                          </div>
                          <v-divider></v-divider>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
              <!-- Arquivos -->
              <v-row class="row-arquivos">
                <v-col
                  cols="12"
                  :xs="12"
                  :sm="6"
                  :md="3"
                  v-for="(linha, idx) in consulta.arquivos"
                  :key="idx"
                >
                  <v-file-input
                    label="Anexar arquivos"
                    multiple
                    v-model="files[idx]"
                    filled
                    rounded
                    dense
                    outlined
                    prepend-inner-icon="mdi-paperclip"
                    prepend-icon=""
                    @change="addArquivo"
                    @click:clear="removeArquivo(idx)"
                  />
                </v-col>
                <!-- <v-col cols="12" :xs="12" :sm="6" :md="3">
                  <v-file-input
                    label="Exame de sangue"
                    multiple
                    v-model="consulta.arquivos"
                    filled
                    rounded
                    dense
                    outlined
                    prepend-inner-icon="mdi-file-document-outline"
                    prepend-icon=""
                    x-small
                  />
                </v-col>
                <v-col cols="12" :xs="12" :sm="6" :md="3">
                  <v-file-input
                    label="Exame de sangue2"
                    multiple
                    v-model="consulta.arquivos"
                    filled
                    rounded
                    dense
                    outlined
                    prepend-inner-icon="mdi-file-document-outline"
                    prepend-icon=""

                  />
                </v-col>
                <v-col cols="12" :xs="12" :sm="6" :md="3">
                  <v-file-input
                    label="Exame de sangue.png"
                    multiple
                    v-model="consulta.arquivos"
                    filled
                    rounded
                    dense
                    outlined
                    prepend-inner-icon="mdi-file-image-outline"
                    prepend-icon=""
                  />
                </v-col> -->
              </v-row>

                <v-row>
                  <v-col>
                    <v-btn color="#E3E3E3" class="d-none d-md-flex" @click="addArquivo">
                      Adicionar outro arquivo
                    </v-btn>
                  </v-col>
                </v-row>
              <!-- Botão de marcarConsulta -->
              <v-row class="mx-auto">
                <v-col class="consulta-modal-marcar text-center">
                  <v-btn color="primary" large @click="update">
                    Salvar Alterações
                  </v-btn>
                  <v-dialog v-model="modalConfirm" persistent max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="white" large dark v-bind="attrs" v-on="on">
                        Cancelar Consulta
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5">
                        Deseja cancelar essa consulta?
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="grey darken-1"
                          text
                          @click="modalConfirm = false"
                        >
                          Não
                        </v-btn>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="modalConfirm = false"
                        >
                          Sim
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "modalEdit",
  props: ["value", "consultaId"],
  data() {
    return {
      valid: true,
      status: [
        { status: "AGUARDANDOA", nome: "Aguardando Consulta" },
        { status: "AGUARDANDOC", nome: "Em Confirmação" },
        { status: "REALIZADO", nome: "Realizado" },
        { status: "CANCELADO", nome: "Cancelado" },
      ],

      medicos: ["Não definido"],

      consulta: {
        id: "",
        status: "",
        dt_inicio: "",
        detalhes: "",
        descricao: "",

        paciente: {
          id: "",
          nome: "",
          data_nascimento: "",
          nome_mae: "",
          registro_hc: "",
        },
        logs: [
          {
            id: "",
            descricao: "",
            data: "",
          },
        ],

        usuario_medico: {
          id: "",
          nome: "",
        },

        arquivos: [
          {
            id: "",
            nome: "",
          },
        ],
      },

      medicoAtual: "Não definido",
      menuDataConsulta: false,
      modalConfirm: false,
      files: [],
    };
  },
  mounted() {
    //this.listaMedicos();
    this.addArquivo();
  },
  watch: {
    consultaId: function (consultaId) {
      this.edit(consultaId);
    },
  },
  methods: {
    edit(consultaId) {
      this.$axios
        .$get("/consulta/" + consultaId)
        .then((response) => {
          response.dt_inicio = this.formataData(response.dt_inicio);

          this.consulta = response;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    update() {
      if (this.$refs.formConsulta.validate()) {
        let consulta = JSON.parse(JSON.stringify(this.consulta));

        let formData = new FormData();

        if (this.files) {
          console.log(this.files);
          for (let i = 0; i < this.files.length; i++) {
            formData.append("arquivos", this.files[i]);
          }
        }
        for (var key in consulta) {
          if (typeof consulta[key] != "object") {
            formData.append(key, consulta[key]);
          }
        }

        this.$axios
          .$put("/consulta/" + this.consultaId, formData)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    formataData(data) {
      let dt = new Date(data)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      //dt = dt.replaceAll("-", "/");
      return dt;
    },

    abreToast(mensagem) {
      this.toastMensagem = mensagem;
      this.toast = true;
    },

    addArquivo() {
      this.consulta.arquivos.push({
        id: "",
        nome: "",
      });
    },

    removeArquivo(idx){
      console.log(idx);
    }


  },
};
</script>

<style>
.consulta-modal-title {
  margin-left: 40px;
}

.consulta-modal-title h4 {
  width: calc(100% - 37px);
  text-align: left;
  border-bottom: 1px solid #b7b7b7;
  line-height: 0.1em;
  margin: 20px 0 20px;
}

.vertical-line {
  border-left: 1px solid #b7b7b7;
  padding-left: 10px;
  height: 50vw;
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.historico-divider {
  width: calc(100%);
  border-bottom: 1px solid #b7b7b7;
  line-height: 0.1em;
  margin: 20px 0 20px;
}

.consulta-modal-title h4 span {
  background: #fff;
  padding: 0 10px;
}

.consulta-modal-marcar .v-btn {
  border-radius: 10px;
  margin-right: 20px;
}

.consulta-modal-marcar .white {
  color: #ce4b39;
}

#input-usage .v-messages,
#input-usage .v-input__slot {
  color: black;
  font-size: 0.85em;
}

#input-usage .row-arquivos .v-label {
  color: black;
  font-size: 0.85em;
}

.card-historico {
  color: black;
  font-size: 0.85em;
}

.card-historico-data {
  color: #b7b7b7;
}
</style>
