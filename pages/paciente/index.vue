<template>
  <v-container fluid style="overflow: auto; padding: 5vh">
    <modalPaciente v-model="modalAtivo" v-bind:pacienteId="pacienteId" @listaPacientes="listaPacientes" @input="mudaStatusModal" />

    <v-card class="mx-auto pa-5 mt-3" width="100%">
      <div class="div-titulo-btn">
        <v-card-title>
          <span class="text-h6">Pacientes</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            background="primary"
            class="div-titulo-btn"
            @click="abreModal(0)"
          >
            Adicionar Paciente
          </v-btn>
        </v-card-actions>
      </div>
      <v-card-text class="text-h5">
        <v-text-field
          v-model="pesquisa"
          prepend-inner-icon="mdi-magnify"
          label="Nome do Paciente, mãe ou registro HC"
          filled
          rounded
          dense
        ></v-text-field>
        <template>
          <v-data-table
            :headers="headers"
            :items="pacientes"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon color="primary" class="mr-2" @click="abreModal(item.id)">
                mdi-square-edit-outline
              </v-icon>
              <v-icon
                color="primary"
                class="mr-2"
                @click="abreModalConfirm(item.id)"
              >
                mdi-trash-can-outline
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
          </v-data-table>
        </template>
      </v-card-text>

      <v-dialog
        class="modal-delete-cofirm"
        v-model="modalConfirm"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title>
            Deseja realmente &nbsp;
            <span style="color: red"> desativar o paciente </span>

            do sistema?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="white" x-large @click="modalConfirm = false">
              Não
            </v-btn>
            <v-btn depressed x-large color="error" @click="deletePaciente()">
              Sim
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import modalPaciente from "@/components/paciente/modal.vue";

export default {
  layout: "main",
  components: {
    modalPaciente,
  },
  data() {
    return {
      headers: [
        { text: "PACIENTE", value: "nome" },
        { text: "MÃE", value: "nome_mae" },
        { text: "NASCIMENTO", value: "data_nascimento" },
        { text: "ÚLTIMA CONSULTA", value: "ultima_consulta" },
        { text: "AÇÕES", value: "actions", sortable: false },
      ],
      pacientes: [
        {
          id: "",
          nome: "",
          data_nascimento: "",
          ultima_consulta: "",
          nome_mae: "",
        },
      ],

      pesquisa: "",

      pacienteId: 0,
      modalAtivo: false,
      modalConfirm: false,
    };
  },
  mounted() {
    this.listaPacientes();
  },
  methods: {
    listaPacientes() {
      this.pacienteId = null
      this.$axios
        .$get("/paciente")
        .then((response) => {
          if (response.dados) {
            response.dados.forEach((paciente) => {
              paciente.data_nascimento = this.formataData(
                paciente.data_nascimento
              );
            });
          }
          this.pacientes = response.dados;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    abreModal(id) {
      this.pacienteId = id;

      this.modalAtivo = !this.modalAtivo;
    },

    deletePaciente() {
      console.log(this.pacienteId);
      this.pacienteId = 0;
    },

    abreModalConfirm(id) {
      this.pacienteId = id;
      this.modalConfirm = !this.modalConfirm;
    },

    formataData(data) {
      let dArr = data.split("-"); // ex input "2010-01-18"
      return dArr[2] + "/" + dArr[1] + "/" + dArr[0]; //ex out: "18/01/10"
    },
    mudaStatusModal(val){
      if(!val)
        this.pacienteId = null
    }
  },
};
</script>

<style>
.paciente-container {
  margin-top: 20px;
  border-radius: 10px;
  background: #fff;
}

.div-titulo-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between !important;
}
</style>
