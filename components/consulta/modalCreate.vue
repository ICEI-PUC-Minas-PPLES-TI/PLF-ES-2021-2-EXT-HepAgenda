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
            <v-form>
              <!-- select pacientes -->
              <v-row class="mt-n5">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-autocomplete
                    v-model="pacienteId"
                    :items="pacientes"
                    hide-details="auto"
                    :clearable="true"
                    label="Paciente"
                    item-text="nome"
                    item-value="id"
                    outlined
                  />
                </v-col>
              </v-row>
              <!-- Data da consulta e select de médico -->
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-menu
                    v-model="menuDataConsulta"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatDate(dataConsulta)"
                        outlined
                        hide-details="auto"
                        append-icon="mdi-calendar"
                        label="Data da consulta"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dataConsulta"
                      @input="menuDataConsulta = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="mt-n3">
                <v-col :md="12" :sm="12" :xl="12" cols="12">
                  <v-select
                    v-model="medico"
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
                    v-model="descricao"
                    hide-details="auto"
                    outlined
                    label="Descrição (Opcional)"
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

    <v-snackbar
      v-model="toast"
      shaped
    >
      {{ toastMensagem }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs " @click="toast = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script src="./modalCreate.js"></script>

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
