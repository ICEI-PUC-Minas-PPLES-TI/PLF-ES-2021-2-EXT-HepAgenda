<template>
      <!-- <v-col :md="10" :offset-md="1" class="paciente-container">
        <v-btn color="primary" large @click="modalAtivo = !modalAtivo">
          Adicionar Paciente
        </v-btn>
        <modalPaciente v-model="modalAtivo" />
      </v-col> -->
  <v-container fluid style="overflow: auto; padding:4vh;">
    <modalPaciente v-model="modalAtivo" v-bind:pacienteId="pacienteId" />

    <v-card class="mx-auto" width="100%">
        <div class="div-titulo-btn">
            <v-card-title>
                <span class="text-h6">Pacientes</span>
            </v-card-title>
            <v-card-actions>
                <v-btn color="primary" background="primary" class="div-titulo-btn" @click="abreModal(0)">
                    Criar Paciente
                </v-btn>
            </v-card-actions>
        </div>
        <v-card-text class="text-h5 ">
            <template>
                <v-data-table :headers="headers" :items="pacientes" :items-per-page="5" class="elevation-1">
                    <template v-slot:item.tipo="{ item }">
                        {{ formataTipo(item.tipo) }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon  color="primary" class="mr-2" @click="abreModal(item.id)">
                            mdi-square-edit-outline
                        </v-icon>
                        <v-icon  color="primary" class="mr-1">
                            mdi-clock-time-four-outline
                        </v-icon>
                        <v-icon  color="primary" @click="deleteItem(item)">
                            mdi-trash-can-outline
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary" @click="initialize">
                            Reset
                        </v-btn>
                    </template>
                </v-data-table>
            </template>
        </v-card-text>
    </v-card>
</v-container>
</template>
<script src="./index.js"> </script>

<style>
  .paciente-container{
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
