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
            <span>Consulta</span>
          </h4>

          <v-btn icon @click="$emit('input', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container fluid id="input-usage">
            <v-form ref="formConsulta" v-model="valid" lazy-validation>
              <client-only>
                <v-row no-gutters>
                  <v-col :md="8" :sm="12" :xl="8" cols="12">
                    <!-- Data da consulta -->
                    <v-row class="mx-auto">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-input
                          :messages="formataData(consulta.dt_inicio)"
                          label="Data da consulta"
                        ></v-input>
                      </v-col>
                    </v-row>
                    <!-- Descrição -->
                    <v-row class="mx-auto">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <label for>Descrição do agendamento</label>
                        <v-textarea
                          class="textareaDescricao"
                          readonly
                          flat
                          solo
                          row-height="10"
                          hide-details="auto"
                          auto-grow
                          v-model="consulta.descricao"
                        ></v-textarea>
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
                          :disabled="['V'].includes($store.getters['login/me'].tipo)"
                        />
                      </v-col>
                    </v-row>
                    <!-- Medico -->
                    <v-row class="mx-auto">
                      <v-col :md="12" :sm="12" :xl="12" cols="12">
                        <v-autocomplete
                          v-model="consulta.usuario_id_medico"
                          :items="medicos"
                          hide-details="auto"
                          :clearable="true"
                          label="Medicos"
                          item-text="nome"
                          item-value="id"
                          outlined
                          :disabled="['V'].includes($store.getters['login/me'].tipo)"
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
                          v-model="consulta.detalhes"
                          counter
                          :rules="[
                            (v) =>
                              (v || '').length <= 60000 ||
                              'Máximo de 60000 caracteres',
                          ]"
                          auto-grow
                          :disabled="['V'].includes($store.getters['login/me'].tipo)"
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
                      <!-- Nome -->
                      <v-row class="mt-n8">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <v-input :messages="consulta.paciente.nome" label="Nome"></v-input>
                        </v-col>
                      </v-row>
                      <!-- Data Nascimento -->
                      <v-row class="mt-n3">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <v-input
                            :messages="
                              formataDataSimples(
                                consulta.paciente.data_nascimento
                              )
                            "
                            label="Data de Nascimento"
                          ></v-input>
                        </v-col>
                      </v-row>
                      <!-- Mae -->
                      <v-row class="mt-n3">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <v-input :messages="consulta.paciente.nome_mae" label="Nome da Mãe"></v-input>
                        </v-col>
                      </v-row>
                      <!-- Registro HC -->
                      <v-row class="mt-n3">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <v-input :messages="consulta.paciente.registro_hc" label="Registro HC"></v-input>
                        </v-col>
                      </v-row>
                      <v-row class="mt-n3 text-right mr-2">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <router-link :to="`/paciente/${consulta.paciente.id}`" target="_blank">
                            Dados do paciente
                          </router-link>
                        </v-col>
                      </v-row>
                      <!-- Barra horizontal -->
                      <v-row class="mt-0">
                        <v-col :md="12" :sm="12" :xl="12" cols="12">
                          <div class="historico-divider"></div>
                          <v-input class="mt-n3" label="Histórico da Consulta"></v-input>
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
                            <div
                              class="card-historico-data text-right"
                            >{{ formataDataSimples(item.data) }}</div>
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
                    v-if="['A', 'M'].includes($store.getters['login/me'].tipo)"
                  >
                    <v-file-input
                      class="arquivo-input"
                      show-size
                      multiple
                      small
                      label="Adicionar arquivo"
                      filled
                      rounded
                      dense
                      outlined
                      prepend-inner-icon="mdi-paperclip"
                      prepend-icon
                      v-model="files"
                      @change="enviaArquivo"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    :xs="12"
                    :sm="6"
                    :md="3"
                    v-for="(linha, idx) in consulta.arquivos"
                    :key="idx"
                  >
                    <v-chip
                      large
                      close
                      @click="baixaArquivo(idx)"
                      @click:close="abreModalConfirmAnexo(idx)"
                    >
                      {{
                        consulta.arquivos[idx].nome.length > 16
                          ? consulta.arquivos[idx].nome.substring(0, 16) + "..."
                          : consulta.arquivos[idx].nome
                      }}
                    </v-chip>
                  </v-col>
                </v-row>

                <!-- Botão de marcarConsulta -->
                <v-row class="mx-auto" v-if="['A', 'M'].includes($store.getters['login/me'].tipo)">
                  <v-col class="consulta-modal-marcar text-center">
                    <v-dialog v-model="modalConfirm" persistent max-width="350">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="error" large text v-bind="attrs" v-on="on">Cancelar Consulta</v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="text-h5">Deseja realmente cancelar essa consulta?</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="grey darken-1" text @click="modalConfirm = false">Não</v-btn>
                          <v-btn color="red darken-1" text @click="cancelaConsulta">Sim</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-btn color="primary" large @click="update">Salvar Alterações</v-btn>
                  </v-col>
                </v-row>
              </client-only>
            </v-form>

            <v-dialog v-model="modalConfirmAnexo" persistent max-width="350">
              <v-card>
                <v-card-title class="text-h5">Deseja realmente excluir o anexo?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="modalConfirmAnexo = false">Não</v-btn>
                  <v-btn color="red darken-1" text @click="removeArquivo">Sim</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="toast" shaped>
      {{ toastMensagem }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="toast = false">Ok</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios2 from "axios";

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
        { status: "CANCELADO", nome: "Não Compareceu" },
      ],

      medicos: [{ nome: "", id: 0 }],


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

        usuario_id_medico: '',

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
      modalConfirmAnexo: false,
      files: [],
      toast: false,
      toastMensagem: "",
    };
  },
  mounted() {
    //this.listaMedicos();
  },
  watch: {
    consultaId: function (consultaId) {
      this.edit(consultaId);
    },
  },
  methods: {

    listaMedicos() {
      return new Promise(resolve => {
        setTimeout(() => {
          this.$axios
            .$get(`/usuario?medico=true&ativo=1`)
            .then((response) => {
              this.medicos = response.dados;
            })
            .catch((error) => {
              console.log(error);
            });
          resolve();
        }, 50);
      });
    },

    async edit(consultaId) {

      await this.listaMedicos();

      this.$axios
        .$get("/consulta/" + consultaId)
        .then((response) => {
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

        for (var key in consulta) {
          if (typeof consulta[key] != "object") {
            formData.append(key, consulta[key]);
          }
        }

        this.queryUpdate(formData);
      }
    },

    formataData(data) {
      const [ano, mes, dia] = data.split("-");
      const mesExtensos = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return `${dia} de ${mesExtensos[parseInt(mes) - 1]} de ${ano}`;
    },

    formataDataSimples(data) {
      if (data.includes("T")) {
        data = data.split("T")[0];
      }
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    },

    abreToast(mensagem) {
      this.toastMensagem = mensagem;
      this.toast = true;
    },

    enviaArquivo() {
      if (this.files && this.files.length > 0) {
        if (this.files[0].size > 2000000) {
          this.abreToast("Arquivo deve ser menor que 2 MB");
          this.edit(this.consulta.id)
          this.files = [];
          return;
        }
        if (this.files[0].name.length > 45) {
          this.abreToast("Erro, nome do arquivo deve ser menor que 45 caracteres");
          this.edit(this.consulta.id)
          this.files = [];
          return;
        }
        let formData = new FormData();
        for (let i = 0; i < this.files.length; i++) {
          formData.append("arquivos", this.files[i]);
        }
        this.queryUpdate(formData);
        this.files = [];
      }
    },

    addArquivo() {
      this.consulta.arquivos.push({
        id: "",
        nome: "",
      });
    },

    baixaArquivo(idx) {
      this.$axios.get('/arquivo/' + this.consulta.arquivos[idx].id, {
        responseType: "blob"
      }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.consulta.arquivos[idx].nome); //or any other extension
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    removeArquivo() {
      let idx = this.idxAux;
      this.$axios
        .$delete("arquivo/" + this.consulta.arquivos[idx].id)
        .then((response) => {
          this.consulta.arquivos.splice(idx, 1);
          this.abreToast("Arquivo removido com sucesso!");
        })
        .catch((error) => {
          console.log(error);
        });

      this.modalConfirmAnexo = false;
    },

    abreModalConfirmAnexo(idx) {
      this.idxAux = idx;
      this.modalConfirmAnexo = true;
    },

    cancelaConsulta() {
      if (this.$refs.formConsulta.validate()) {
        this.consulta.status = "CANCELADO";
        let consulta = JSON.parse(JSON.stringify(this.consulta));

        let formData = new FormData();

        for (var key in consulta) {
          if (typeof consulta[key] != "object") {
            formData.append(key, consulta[key]);
          }
        }
        this.queryUpdate(formData);
      }
      this.modalConfirm = false;
    },

    queryUpdate(formData) {
      this.$axios
        .$put("/consulta/" + this.consultaId, formData)
        .then((response) => {
          this.edit(this.consulta.id);
          this.abreToast("Consulta atualizada com sucesso!");
        })
        .catch((error) => {
          let retorno = error.response.data.message.replace(/(.{50})/g, '$1\n');
          this.abreToast(retorno);
        });
    },
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
  max-height: 450px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.historico-divider {
  width: calc(100%);
  border-bottom: 1px solid #b7b7b7;
  line-height: 0.1em;
  margin: 0px 0 20px;
}

.consulta-modal-title h4 span {
  background: #fff;
  padding: 0 10px;
}

.consulta-modal-marcar .v-btn {
  border-radius: 10px;
  margin-right: 20px;
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

.textareaDescricao .v-text-field__slot textarea {
  margin-left: -10px !important;
}

.arquivo-input {
  max-width: 200px !important;
  height: 50px !important;
}

.arquivo-input .v-input__slot {
  height: 52px !important;
}

.arquivo-input .v-input__slot:hover {
  cursor: pointer !important;
}

.arquivo-input .v-label {
  margin-top: 6px !important;
}

.arquivo-input .v-input__prepend-inner {
  align-self: center;
}

.row-arquivos {
  margin-left: 5px;
}

.v-chip .v-size--large {
  max-width: 300px !important;
}
</style>
